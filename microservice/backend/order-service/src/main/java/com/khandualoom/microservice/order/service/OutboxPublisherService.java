package com.khandualoom.microservice.order.service;

import com.khandualoom.microservice.common.messaging.outbox.OutboxStatus;
import com.khandualoom.microservice.order.model.OutboxEvent;
import com.khandualoom.microservice.order.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class OutboxPublisherService {

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final Random random = new Random();

    private static final int MAX_RETRIES = 5;

    @Scheduled(fixedDelay = 1000)
    @Transactional
    public void publishPendingOutboxEvents() {
        List<OutboxEvent> pending;
        try {
            pending = outboxEventRepository.claimPendingBatch(50);
        } catch (Exception e) {
            pending = outboxEventRepository.findTop50ByStatusOrderByCreatedAtAsc(OutboxStatus.PENDING);
        }

        if (pending.isEmpty()) return;

        log.debug("Found {} pending order outbox events to publish", pending.size());

        for (OutboxEvent event : pending) {
            try {
                String topic = resolveTopic(event.getEventType());
                kafkaTemplate.send(topic, event.getAggregateId(), event.getPayload()).get();

                event.setStatus(OutboxStatus.PUBLISHED);
                event.setPublishedAt(Instant.now());
                outboxEventRepository.save(event);
                log.info("Published order outbox event [{}] to topic [{}]", event.getId(), topic);
            } catch (Exception e) {
                log.error("Failed to publish order outbox event [{}]: {}", event.getId(), e.getMessage());
                int retries = event.getRetryCount() + 1;
                event.setRetryCount(retries);
                event.setLastError(e.getMessage());

                if (retries >= MAX_RETRIES) {
                    event.setStatus(OutboxStatus.DEAD_LETTER);
                    log.error("Order outbox event [{}] moved to DEAD_LETTER after {} attempts", event.getId(), retries);
                } else {
                    event.setStatus(OutboxStatus.FAILED);
                    long delayMillis = (long) Math.pow(2, retries) * 1000L + random.nextInt(500);
                    event.setNextRetryAt(Instant.now().plusMillis(delayMillis));
                }
                outboxEventRepository.save(event);
            }
        }
    }

    private String resolveTopic(String eventType) {
        if ("OrderCreatedEvent".equalsIgnoreCase(eventType) || "orders.order-created".equalsIgnoreCase(eventType)) {
            return "orders.order-created";
        }
        if ("orders.order-confirmed".equalsIgnoreCase(eventType)) {
            return "orders.order-confirmed";
        }
        if ("inventory.release-reservation".equalsIgnoreCase(eventType)) {
            return "inventory.release-reservation";
        }
        return "orders." + eventType.toLowerCase();
    }
}
