package com.vastraloom.microservice.order.service;

import com.vastraloom.microservice.order.model.OutboxEvent;
import com.vastraloom.microservice.order.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OutboxPublisherService {

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Scheduled(fixedDelay = 5000)
    @Transactional
    public void publishPendingOutboxEvents() {
        List<OutboxEvent> pending = outboxEventRepository.findTop50ByProcessedFalseOrderByCreatedAtAsc();
        if (pending.isEmpty()) return;

        log.debug("Found {} pending outbox events to publish", pending.size());

        for (OutboxEvent event : pending) {
            try {
                String topic = "orders." + event.getEventType().toLowerCase() + ".v1";
                kafkaTemplate.send(topic, event.getAggregateId(), event.getPayload());
                event.setProcessed(true);
                outboxEventRepository.save(event);
                log.info("Published outbox event {} to topic {}", event.getId(), topic);
            } catch (Exception e) {
                log.warn("Failed to publish outbox event {}: {}", event.getId(), e.getMessage());
            }
        }
    }
}
