package com.khandualoom.microservice.contract.event;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

public record EventEnvelope<T extends Serializable>(
    UUID eventId,
    String eventType,
    String aggregateType,
    String aggregateId,
    Instant timestamp,
    String version,
    String correlationId,
    T payload
) implements Serializable {

    public static <T extends Serializable> EventEnvelope<T> of(
        String eventType,
        String aggregateType,
        String aggregateId,
        String correlationId,
        T payload
    ) {
        return new EventEnvelope<>(
            UUID.randomUUID(),
            eventType,
            aggregateType,
            aggregateId,
            Instant.now(),
            "1.0",
            correlationId,
            payload
        );
    }
}
