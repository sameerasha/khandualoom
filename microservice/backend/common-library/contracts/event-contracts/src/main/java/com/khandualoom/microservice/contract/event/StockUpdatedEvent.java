package com.khandualoom.microservice.contract.event;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

public record StockUpdatedEvent(
    UUID eventId,
    Long productId,
    Integer quantityDelta,
    Integer availableStock,
    String reason,
    Instant timestamp
) implements Serializable {

    public static StockUpdatedEvent create(
        Long productId,
        Integer quantityDelta,
        Integer availableStock,
        String reason
    ) {
        return new StockUpdatedEvent(
            UUID.randomUUID(),
            productId,
            quantityDelta,
            availableStock,
            reason,
            Instant.now()
        );
    }
}
