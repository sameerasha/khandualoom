package com.khandualoom.microservice.common.event;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

public record StockUpdatedEvent(
    UUID eventId,
    Long productId,
    int quantityChange,
    int availableStock,
    String reason,
    Instant timestamp
) implements Serializable {

    public static StockUpdatedEvent create(
        Long productId,
        int quantityChange,
        int availableStock,
        String reason
    ) {
        return new StockUpdatedEvent(
            UUID.randomUUID(),
            productId,
            quantityChange,
            availableStock,
            reason,
            Instant.now()
        );
    }
}
