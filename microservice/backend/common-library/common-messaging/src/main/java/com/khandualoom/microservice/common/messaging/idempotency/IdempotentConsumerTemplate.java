package com.khandualoom.microservice.common.messaging.idempotency;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class IdempotentConsumerTemplate {

    private final ProcessedEventRepository processedEventRepository;

    @Transactional
    public boolean execute(UUID eventId, String consumerGroup, String eventType, Runnable businessAction) {
        if (eventId == null) {
            log.warn("Null eventId received for consumer group: {}. Executing without idempotency check.", consumerGroup);
            businessAction.run();
            return true;
        }

        if (processedEventRepository.existsByEventIdAndConsumerGroup(eventId, consumerGroup)) {
            log.info("Duplicate event [{}] already processed by group [{}]. Acknowledging and skipping.", eventId, consumerGroup);
            return false;
        }

        businessAction.run();

        processedEventRepository.save(new ProcessedEvent(eventId, consumerGroup, eventType));
        log.debug("Recorded processed event [{}] for group [{}]", eventId, consumerGroup);
        return true;
    }
}
