package com.khandualoom.microservice.contract.event;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

public record InventoryReservationFailedEvent(
    UUID eventId,
    Long orderId,
    String reason,
    Instant timestamp
) implements Serializable {

    public static InventoryReservationFailedEvent of(Long orderId, String reason) {
        return new InventoryReservationFailedEvent(UUID.randomUUID(), orderId, reason, Instant.now());
    }
}
