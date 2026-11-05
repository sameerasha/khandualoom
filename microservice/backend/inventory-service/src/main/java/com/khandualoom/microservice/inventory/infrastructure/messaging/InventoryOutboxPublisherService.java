package com.khandualoom.microservice.inventory.infrastructure.messaging;

import com.khandualoom.microservice.common.messaging.outbox.OutboxStatus;
import com.khandualoom.microservice.inventory.infrastructure.persistence.entity.InventoryOutboxJpaEntity;
import com.khandualoom.microservice.inventory.infrastructure.persistence.repository.InventoryOutboxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.Random;

@Service
@Slf4j
@RequiredArgsConstructor
public class InventoryOutboxPublisherService {

    private final InventoryOutboxRepository outboxRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final Random random = new Random();

    private static final int MAX_RETRIES = 5;

    @Scheduled(fixedDelay = 1000)
    @Transactional
    public void publishPendingEvents() {
        List<InventoryOutboxJpaEntity> events;
        try {
            events = outboxRepository.claimPendingBatch(50);
        } catch (Exception e) {
            events = outboxRepository.findTop50ByStatusOrderByCreatedAtAsc(OutboxStatus.PENDING);
        }

        if (events.isEmpty()) {
            return;
        }

        log.debug("Processing {} inventory outbox events", events.size());

        for (InventoryOutboxJpaEntity event : events) {
            try {
                String topic = "inventory.reserved".equalsIgnoreCase(event.getEventType())
                        ? "inventory.reserved"
                        : "inventory.reservation-failed";

                ProducerRecord<String, Object> record = new ProducerRecord<>(topic, event.getAggregateId(), event.getPayload());
                if (event.getTraceparent() != null) {
                    record.headers().add("traceparent", event.getTraceparent().getBytes(StandardCharsets.UTF_8));
                }
                if (event.getCorrelationId() != null) {
                    record.headers().add("X-Correlation-ID", event.getCorrelationId().getBytes(StandardCharsets.UTF_8));
                }
                if (event.getCausationId() != null) {
                    record.headers().add("X-Causation-ID", event.getCausationId().getBytes(StandardCharsets.UTF_8));
                }

                kafkaTemplate.send(record).get();

                event.setStatus(OutboxStatus.PUBLISHED);
                event.setPublishedAt(Instant.now());
                outboxRepository.save(event);
                log.info("Successfully published inventory outbox event [{}] to topic [{}]", event.getId(), topic);
            } catch (Exception e) {
                log.error("Failed to publish inventory outbox event [{}]: {}", event.getId(), e.getMessage());
                int retries = event.getRetryCount() + 1;
                event.setRetryCount(retries);
                event.setLastError(e.getMessage());

                if (retries >= MAX_RETRIES) {
                    event.setStatus(OutboxStatus.DEAD_LETTER);
                    log.error("Inventory outbox event [{}] moved to DEAD_LETTER after {} failed attempts", event.getId(), retries);
                } else {
                    event.setStatus(OutboxStatus.FAILED);
                    long delayMillis = (long) Math.pow(2, retries) * 1000L + random.nextInt(500);
                    event.setNextRetryAt(Instant.now().plusMillis(delayMillis));
                }
                outboxRepository.save(event);
            }
        }
    }
}
