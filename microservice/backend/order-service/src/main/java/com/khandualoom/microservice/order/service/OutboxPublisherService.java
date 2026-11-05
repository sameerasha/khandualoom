package com.khandualoom.microservice.order.service;

import com.khandualoom.microservice.common.messaging.outbox.OutboxStatus;
import com.khandualoom.microservice.order.model.OutboxEvent;
import com.khandualoom.microservice.order.repository.OutboxEventRepository;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Tags;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OutboxPublisherService {

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final Optional<MeterRegistry> meterRegistry;
    private final Random random = new Random();
    private final String publisherId = UUID.randomUUID().toString().substring(0, 8);

    private static final int MAX_RETRIES = 5;
    private static final int LEASE_SECONDS = 30;

    @Scheduled(fixedDelay = 1000)
    @Transactional
    public void publishPendingOutboxEvents() {
        recordBacklogMetrics();

        List<OutboxEvent> pending;
        try {
            pending = outboxEventRepository.claimPendingBatch(50);
        } catch (Exception e) {
            pending = outboxEventRepository.findTop50ByStatusOrderByCreatedAtAsc(OutboxStatus.PENDING);
        }

        if (pending.isEmpty()) return;

        log.debug("Found {} pending order outbox events to publish", pending.size());

        for (OutboxEvent event : pending) {
            // Acquire publisher lease
            event.setLockedBy(publisherId);
            event.setLockedUntil(Instant.now().plusSeconds(LEASE_SECONDS));

            try {
                String topic = resolveTopic(event.getEventType());
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
                event.setLockedBy(null);
                event.setLockedUntil(null);
                outboxEventRepository.save(event);
                log.info("Published order outbox event [{}] to topic [{}]", event.getId(), topic);
            } catch (Exception e) {
                log.error("Failed to publish order outbox event [{}]: {}", event.getId(), e.getMessage());
                int retries = event.getRetryCount() + 1;
                event.setRetryCount(retries);
                event.setLastError(e.getMessage());
                event.setLockedBy(null);
                event.setLockedUntil(null);

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

    /**
     * Purges successfully published outbox events older than 7 days to eliminate MVCC bloat.
     */
    @Scheduled(fixedDelay = 86400000, initialDelay = 60000)
    @Transactional
    public void purgeOldPublishedEvents() {
        try {
            Instant cutoff = Instant.now().minus(7, ChronoUnit.DAYS);
            int purged = outboxEventRepository.purgePublishedEvents(cutoff);
            if (purged > 0) {
                log.info("Purged {} published order outbox events older than 7 days", purged);
            }
        } catch (Exception e) {
            log.warn("Failed to purge old published order outbox events: {}", e.getMessage());
        }
    }

    private void recordBacklogMetrics() {
        meterRegistry.ifPresent(registry -> {
            try {
                long backlog = outboxEventRepository.countPendingBacklog();
                registry.gauge("khandualoom_outbox_backlog_count", Tags.of("service", "order-service"), backlog);

                Instant oldest = outboxEventRepository.findOldestUnpublishedCreatedAt();
                double ageSeconds = oldest != null ? Duration.between(oldest, Instant.now()).getSeconds() : 0.0;
                registry.gauge("khandualoom_outbox_oldest_event_age_seconds", Tags.of("service", "order-service"), ageSeconds);
            } catch (Exception ignored) {
                // Skip metric recording if database query fails or in partial test environments
            }
        });
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
