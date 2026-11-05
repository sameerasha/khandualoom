package com.khandualoom.microservice.contract.event;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

public record InventoryReservedEvent(
    UUID eventId,
    Long orderId,
    UUID reservationId,
    Instant timestamp
) implements Serializable {

    public static InventoryReservedEvent of(Long orderId, UUID reservationId) {
        return new InventoryReservedEvent(UUID.randomUUID(), orderId, reservationId, Instant.now());
    }
}
