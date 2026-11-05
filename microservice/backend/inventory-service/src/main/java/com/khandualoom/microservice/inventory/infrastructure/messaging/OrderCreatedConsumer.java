package com.khandualoom.microservice.inventory.infrastructure.messaging;

import com.khandualoom.microservice.common.event.OrderCreatedEvent;
import com.khandualoom.microservice.common.messaging.idempotency.IdempotentConsumerTemplate;
import com.khandualoom.microservice.inventory.application.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class OrderCreatedConsumer {

    private final InventoryService inventoryService;
    private final IdempotentConsumerTemplate idempotentConsumerTemplate;

    private static final String CONSUMER_GROUP = "inventory-service-group";

    @KafkaListener(topics = {"orders.order-created", "order-created"}, groupId = CONSUMER_GROUP)
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Inventory consumer received OrderCreatedEvent for order ID: {}", event.orderId());
        UUID eventId = event.eventId() != null
                ? event.eventId()
                : UUID.nameUUIDFromBytes(("OrderCreated-" + event.orderId()).getBytes());

        idempotentConsumerTemplate.execute(eventId, CONSUMER_GROUP, "OrderCreatedEvent", () -> {
            inventoryService.processOrderReservation(event.orderId(), event.items());
        });
    }

    @KafkaListener(topics = "inventory.release-reservation", groupId = CONSUMER_GROUP)
    public void handleCompensateReservation(ConsumerRecord<String, Object> record) {
        try {
            Long orderId = Long.valueOf(record.key());
            log.info("Inventory consumer executing compensation for cancelled order ID: {}", orderId);
            // Deterministic event ID surviving DLQ retries & replay without relying on transient record.offset()
            UUID eventId = UUID.nameUUIDFromBytes(("ReleaseReservation-Order-" + orderId).getBytes());

            idempotentConsumerTemplate.execute(eventId, CONSUMER_GROUP, "ReleaseReservationEvent", () -> {
                inventoryService.releaseReservation(orderId);
            });
        } catch (Exception e) {
            log.error("Failed to execute inventory compensation: {}", e.getMessage(), e);
        }
    }
}
