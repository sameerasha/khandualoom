package com.khandualoom.microservice.notification.consumer;

import com.khandualoom.microservice.common.event.OrderCreatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class OrderNotificationConsumer {

    // In-memory or Redis-based deduplication cache
    private final ConcurrentHashMap<String, Boolean> processedEvents = new ConcurrentHashMap<>();

    @RetryableTopic(
        attempts = "3",
        backoff = @Backoff(delay = 1000, multiplier = 2.0)
    )
    @KafkaListener(topics = "orders.order-created.v1", groupId = "notification-service-group")
    public void handleOrderCreated(OrderCreatedEvent event) {
        String eventKey = event.eventId().toString();

        if (processedEvents.containsKey(eventKey)) {
            log.info("Duplicate event ignored: {}", eventKey);
            return;
        }

        log.info("Sending Order Confirmation Email to: {} for Order #{}", event.customerEmail(), event.orderId());
        log.info("Sending SMS dispatch notice to: {}", event.customerPhone());

        processedEvents.put(eventKey, true);
    }
}
