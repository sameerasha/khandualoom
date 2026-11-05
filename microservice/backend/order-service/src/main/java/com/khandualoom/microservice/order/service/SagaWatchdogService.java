package com.khandualoom.microservice.order.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.contract.event.PaymentFailedEvent;
import com.khandualoom.microservice.order.model.OrderStatus;
import com.khandualoom.microservice.order.model.OutboxEvent;
import com.khandualoom.microservice.order.model.PaymentStatus;
import com.khandualoom.microservice.order.model.SagaInstance;
import com.khandualoom.microservice.order.repository.OrderRepository;
import com.khandualoom.microservice.order.repository.OutboxEventRepository;
import com.khandualoom.microservice.order.repository.SagaInstanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class SagaWatchdogService {

    private final SagaInstanceRepository sagaInstanceRepository;
    private final OrderRepository orderRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;
    private final Optional<MeterRegistry> meterRegistry;

    /**
     * Periodic watchdog running every 60 seconds to detect and recover overdue Saga instances.
     * Guarantees that no order remains stranded indefinitely in PENDING or PAYMENT_PENDING.
     */
    @Scheduled(fixedDelay = 60000)
    public void recoverOverdueSagas() {
        Instant now = Instant.now();
        List<SagaInstance> overdueSagas = sagaInstanceRepository.findOverdueSagas(now);

        if (overdueSagas.isEmpty()) {
            return;
        }

        log.info("Saga Watchdog found {} overdue Saga instances to recover", overdueSagas.size());

        for (SagaInstance saga : overdueSagas) {
            try {
                recoverSingleSaga(saga);
            } catch (OptimisticLockingFailureException e) {
                log.warn("Saga #{} or Order #{} was concurrently modified by another process. Skipping watchdog recovery: {}",
                        saga.getSagaId(), saga.getOrderId(), e.getMessage());
            } catch (Exception e) {
                log.error("Unexpected error during watchdog recovery of Saga #{}: {}", saga.getSagaId(), e.getMessage(), e);
            }
        }
    }

    /**
     * Recovers a single overdue Saga in an isolated new transaction.
     * Prevents failures or race conflicts in one saga from rolling back other recoveries.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recoverSingleSaga(SagaInstance saga) {
        orderRepository.findById(saga.getOrderId()).ifPresent(order -> {
            log.warn("Recovering overdue Saga #{} for Order #{}. Current Order Status: {}, Saga Step: {}",
                    saga.getSagaId(), order.getId(), order.getOrderStatus(), saga.getCurrentStep());

            if (order.getOrderStatus() == OrderStatus.PAYMENT_PENDING || order.getOrderStatus() == OrderStatus.PENDING) {
                // Timeout compensation: Cancel order and release reserved stock
                order.setOrderStatus(OrderStatus.CANCELLED);
                order.setPaymentStatus(PaymentStatus.FAILED);
                orderRepository.save(order);

                saga.triggerCompensation("Saga Watchdog timeout: Checkout window expired without confirmation");
                saga.markCompensated();
                sagaInstanceRepository.save(saga);

                // Increment watchdog recovery metric
                meterRegistry.ifPresent(registry ->
                        Counter.builder("khandualoom_saga_watchdog_recoveries")
                                .description("Count of overdue Sagas compensated by watchdog")
                                .register(registry)
                                .increment()
                );

                // Emit inventory release compensation event via Outbox
                try {
                    PaymentFailedEvent compensationEvent = PaymentFailedEvent.of(
                            order.getId(),
                            "TIMEOUT",
                            order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO,
                            "Saga deadline expired"
                    );
                    String json = objectMapper.writeValueAsString(compensationEvent);
                    OutboxEvent outbox = new OutboxEvent("Order", String.valueOf(order.getId()),
                            "inventory.release-reservation", json);
                    outboxEventRepository.save(outbox);
                    log.info("Saga Watchdog triggered inventory compensation for timed out Order #{}", order.getId());
                } catch (Exception e) {
                    log.error("Failed to serialize timeout compensation outbox event: {}", e.getMessage());
                }
            } else if (order.getOrderStatus() == OrderStatus.CONFIRMED) {
                saga.markSucceeded();
                sagaInstanceRepository.save(saga);
                log.info("Saga Watchdog reconciled confirmed Order #{} into SUCCEEDED state", order.getId());
            } else if (order.getOrderStatus() == OrderStatus.CANCELLED) {
                saga.markCompensated();
                sagaInstanceRepository.save(saga);
            }
        });
    }
}
