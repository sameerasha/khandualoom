package com.khandualoom.microservice.order.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.contract.event.PaymentCompletedEvent;
import com.khandualoom.microservice.common.messaging.idempotency.IdempotentConsumerTemplate;
import com.khandualoom.microservice.contract.event.InventoryReservationFailedEvent;
import com.khandualoom.microservice.contract.event.InventoryReservedEvent;
import com.khandualoom.microservice.contract.event.PaymentFailedEvent;
import com.khandualoom.microservice.order.model.*;
import com.khandualoom.microservice.order.repository.OrderRepository;
import com.khandualoom.microservice.order.repository.OutboxEventRepository;
import com.khandualoom.microservice.order.repository.SagaInstanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderSagaOrchestrator {

    private final OrderRepository orderRepository;
    private final SagaInstanceRepository sagaInstanceRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final IdempotentConsumerTemplate idempotentConsumerTemplate;
    private final ObjectMapper objectMapper;

    private static final String CONSUMER_GROUP = "order-saga-orchestrator-group";

    @KafkaListener(topics = "inventory.reserved", groupId = CONSUMER_GROUP)
    @Transactional
    public void onInventoryReserved(InventoryReservedEvent event) {
        log.info("Saga Orchestrator: Received InventoryReservedEvent for order: {}", event.orderId());
        UUID eventId = UUID.nameUUIDFromBytes(("InventoryReserved-" + event.orderId()).getBytes());

        idempotentConsumerTemplate.execute(eventId, CONSUMER_GROUP, "InventoryReservedEvent", () -> {
            orderRepository.findById(event.orderId()).ifPresent(order -> {
                if (order.getOrderStatus() == OrderStatus.CANCELLED) {
                    log.warn("Inventory reserved event arrived for already CANCELLED order #{}. Triggering compensation release.", order.getId());
                    saveOutboxEvent("inventory.release-reservation", String.valueOf(order.getId()), event);
                    return;
                }

                SagaInstance saga = sagaInstanceRepository.findByOrderId(order.getId())
                        .orElseGet(() -> SagaInstance.start(order.getId(), 900));

                if (order.getOrderStatus() == OrderStatus.PENDING) {
                    if (order.getPaymentMethod() == PaymentMethod.COD) {
                        order.setOrderStatus(OrderStatus.CONFIRMED);
                        order.setPaymentStatus(PaymentStatus.PENDING);
                        orderRepository.save(order);

                        saga.markSucceeded();
                        sagaInstanceRepository.save(saga);

                        saveOutboxEvent("orders.order-confirmed", String.valueOf(order.getId()), event);
                        log.info("COD Order #{} confirmed following inventory reservation. Saga succeeded.", order.getId());
                    } else {
                        order.setOrderStatus(OrderStatus.PAYMENT_PENDING);
                        orderRepository.save(order);

                        saga.transitionTo(SagaStep.PAYMENT_PROCESSING, SagaStatus.IN_PROGRESS, 900);
                        sagaInstanceRepository.save(saga);
                        log.info("Prepaid Order #{} transitioned to PAYMENT_PENDING with 15-min payment deadline", order.getId());
                    }
                }
            });
        });
    }

    @KafkaListener(topics = "inventory.reservation-failed", groupId = CONSUMER_GROUP)
    @Transactional
    public void onInventoryFailed(InventoryReservationFailedEvent event) {
        log.warn("Saga Orchestrator: Received InventoryReservationFailedEvent for order: {}. Reason: {}",
                event.orderId(), event.reason());
        UUID eventId = UUID.nameUUIDFromBytes(("InventoryFailed-" + event.orderId()).getBytes());

        idempotentConsumerTemplate.execute(eventId, CONSUMER_GROUP, "InventoryReservationFailedEvent", () -> {
            orderRepository.findById(event.orderId()).ifPresent(order -> {
                order.setOrderStatus(OrderStatus.CANCELLED);
                orderRepository.save(order);

                sagaInstanceRepository.findByOrderId(order.getId()).ifPresent(saga -> {
                    saga.triggerCompensation(event.reason());
                    saga.markCompensated();
                    sagaInstanceRepository.save(saga);
                });

                log.info("Order #{} cancelled and Saga marked compensated due to inventory reservation failure", order.getId());
            });
        });
    }

    @KafkaListener(topics = "payment-completed", groupId = CONSUMER_GROUP)
    @Transactional
    public void onPaymentCompleted(PaymentCompletedEvent event) {
        log.info("Saga Orchestrator: Received PaymentCompletedEvent for order: {}", event.orderId());
        UUID eventId = UUID.nameUUIDFromBytes(("PaymentCompleted-" + event.orderId() + "-" + event.paymentId()).getBytes());

        idempotentConsumerTemplate.execute(eventId, CONSUMER_GROUP, "PaymentCompletedEvent", () -> {
            orderRepository.findById(event.orderId()).ifPresent(order -> {
                if (order.getOrderStatus() == OrderStatus.CANCELLED) {
                    log.warn("Late payment completed received for already CANCELLED order #{}. Routing to reconciliation outbox.", order.getId());
                    saveOutboxEvent("orders.late-payment-reconciliation", String.valueOf(order.getId()), event);
                    return;
                }

                order.setPaymentStatus(PaymentStatus.COMPLETED);
                order.setOrderStatus(OrderStatus.CONFIRMED);
                order.setRazorpayPaymentId(event.paymentId());
                orderRepository.save(order);

                sagaInstanceRepository.findByOrderId(order.getId()).ifPresent(saga -> {
                    saga.markSucceeded();
                    sagaInstanceRepository.save(saga);
                });

                saveOutboxEvent("orders.order-confirmed", String.valueOf(order.getId()), event);
                log.info("Order #{} fully paid and confirmed via Saga. Dispatched order-confirmed to outbox.", order.getId());
            });
        });
    }

    @KafkaListener(topics = "payments.payment-failed", groupId = CONSUMER_GROUP)
    @Transactional
    public void onPaymentFailed(PaymentFailedEvent event) {
        log.warn("Saga Orchestrator: Received PaymentFailedEvent for order: {}. Triggering inventory compensation.",
                event.orderId());
        UUID eventId = UUID.nameUUIDFromBytes(("PaymentFailed-" + event.orderId()).getBytes());

        idempotentConsumerTemplate.execute(eventId, CONSUMER_GROUP, "PaymentFailedEvent", () -> {
            orderRepository.findById(event.orderId()).ifPresent(order -> {
                if (order.getOrderStatus() == OrderStatus.CONFIRMED) {
                    log.warn("Ignoring payment failure event for already CONFIRMED order #{}", order.getId());
                    return;
                }

                order.setPaymentStatus(PaymentStatus.FAILED);
                order.setOrderStatus(OrderStatus.CANCELLED);
                orderRepository.save(order);

                sagaInstanceRepository.findByOrderId(order.getId()).ifPresent(saga -> {
                    saga.triggerCompensation("Payment failure: " + event.failureReason());
                    saga.markCompensated();
                    sagaInstanceRepository.save(saga);
                });

                // Saga Compensation Step: Publish inventory release event via Outbox
                saveOutboxEvent("inventory.release-reservation", String.valueOf(order.getId()), event);
                log.info("Saved compensation event to outbox to release inventory for cancelled order: {}", order.getId());
            });
        });
    }

    private void saveOutboxEvent(String eventType, String aggregateId, Object payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            OutboxEvent outbox = new OutboxEvent("Order", aggregateId, eventType, json);
            outboxEventRepository.save(outbox);
        } catch (Exception e) {
            log.error("Failed to save saga outbox event for {}: {}", eventType, e.getMessage());
        }
    }
}
