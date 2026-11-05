package com.khandualoom.microservice.payment.infrastructure.messaging;

import com.khandualoom.microservice.common.messaging.outbox.OutboxStatus;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentOutboxJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.repository.PaymentOutboxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Random;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentOutboxPublisherService {

    private final PaymentOutboxRepository outboxRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final Random random = new Random();

    private static final int MAX_RETRIES = 5;

    @Scheduled(fixedDelay = 1000)
    @Transactional
    public void publishPendingEvents() {
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
            try {
                // Topic mapping based on event type
                String topic = "payment-completed".equalsIgnoreCase(event.getEventType())
                        ? "payment-completed"
                        : "payments.payment-failed";

                kafkaTemplate.send(topic, event.getAggregateId(), event.getPayload()).get();

                event.setStatus(OutboxStatus.PUBLISHED);
                event.setPublishedAt(Instant.now());
                outboxRepository.save(event);
                log.info("Successfully published payment outbox event [{}] to topic [{}]", event.getId(), topic);
            } catch (Exception e) {
                log.error("Failed to publish payment outbox event [{}]: {}", event.getId(), e.getMessage());
                int retries = event.getRetryCount() + 1;
                event.setRetryCount(retries);
                event.setLastError(e.getMessage());

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
}
