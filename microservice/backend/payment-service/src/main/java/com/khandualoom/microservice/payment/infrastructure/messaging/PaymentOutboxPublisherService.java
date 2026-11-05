package com.khandualoom.microservice.payment.infrastructure.messaging;

import com.khandualoom.microservice.common.messaging.outbox.OutboxStatus;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentOutboxJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.repository.PaymentOutboxRepository;
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

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentOutboxPublisherService {

    private final PaymentOutboxRepository outboxRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final Optional<MeterRegistry> meterRegistry;
    private final Random random = new Random();
    private final String publisherId = UUID.randomUUID().toString().substring(0, 8);

    private static final int MAX_RETRIES = 5;
    private static final int LEASE_SECONDS = 30;

    @Scheduled(fixedDelay = 1000)
    @Transactional
    public void publishPendingEvents() {
        recordBacklogMetrics();

        List<PaymentOutboxJpaEntity> events;
        try {
            events = outboxRepository.claimPendingBatch(50);
        } catch (Exception e) {
            events = outboxRepository.findTop50ByStatusOrderByCreatedAtAsc(OutboxStatus.PENDING);
        }

        if (events.isEmpty()) {
            return;
        }

        log.debug("Processing {} payment outbox events", events.size());

        for (PaymentOutboxJpaEntity event : events) {
            // Acquire publisher lease
            event.setLockedBy(publisherId);
            event.setLockedUntil(Instant.now().plusSeconds(LEASE_SECONDS));

            try {
                // Topic mapping based on event type
                String topic;
                if ("payment-completed".equalsIgnoreCase(event.getEventType())) {
                    topic = "payment-completed";
                } else if ("payments.refund-processed".equalsIgnoreCase(event.getEventType())) {
                    topic = "payments.refund-processed";
                } else if ("payments.refund-failed".equalsIgnoreCase(event.getEventType())) {
                    topic = "payments.refund-failed";
                } else {
                    topic = "payments.payment-failed";
                }

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
                outboxRepository.save(event);
                log.info("Successfully published payment outbox event [{}] to topic [{}]", event.getId(), topic);
            } catch (Exception e) {
                log.error("Failed to publish payment outbox event [{}]: {}", event.getId(), e.getMessage());
                int retries = event.getRetryCount() + 1;
                event.setRetryCount(retries);
                event.setLastError(e.getMessage());
                event.setLockedBy(null);
                event.setLockedUntil(null);

                if (retries >= MAX_RETRIES) {
                    event.setStatus(OutboxStatus.DEAD_LETTER);
                    log.error("Payment outbox event [{}] moved to DEAD_LETTER after {} failed attempts", event.getId(), retries);
                } else {
                    event.setStatus(OutboxStatus.FAILED);
                    // Exponential backoff with jitter: 2^retry * 1000ms + random jitter
                    long delayMillis = (long) Math.pow(2, retries) * 1000L + random.nextInt(500);
                    event.setNextRetryAt(Instant.now().plusMillis(delayMillis));
                }
                outboxRepository.save(event);
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
            int purged = outboxRepository.purgePublishedEvents(cutoff);
            if (purged > 0) {
                log.info("Purged {} published payment outbox events older than 7 days", purged);
            }
        } catch (Exception e) {
            log.warn("Failed to purge old published payment outbox events: {}", e.getMessage());
        }
    }

    private void recordBacklogMetrics() {
        meterRegistry.ifPresent(registry -> {
            try {
                long backlog = outboxRepository.countPendingBacklog();
                registry.gauge("khandualoom_outbox_backlog_count", Tags.of("service", "payment-service"), backlog);

                Instant oldest = outboxRepository.findOldestUnpublishedCreatedAt();
                double ageSeconds = oldest != null ? Duration.between(oldest, Instant.now()).getSeconds() : 0.0;
                registry.gauge("khandualoom_outbox_oldest_event_age_seconds", Tags.of("service", "payment-service"), ageSeconds);
            } catch (Exception ignored) {
                // Skip metric recording if database query fails or in partial test environments
            }
        });
    }
}
