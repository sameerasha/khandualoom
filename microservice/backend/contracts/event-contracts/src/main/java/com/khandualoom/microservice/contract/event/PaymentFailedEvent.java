package com.khandualoom.microservice.contract.event;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentFailedEvent(
    UUID eventId,
    Long orderId,
    String paymentId,
    BigDecimal amount,
    String failureReason,
    Instant timestamp
) implements Serializable {

    public static PaymentFailedEvent of(Long orderId, String paymentId, BigDecimal amount, String failureReason) {
        return new PaymentFailedEvent(UUID.randomUUID(), orderId, paymentId, amount, failureReason, Instant.now());
    }
}
