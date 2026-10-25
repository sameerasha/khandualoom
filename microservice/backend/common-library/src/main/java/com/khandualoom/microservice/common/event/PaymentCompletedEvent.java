package com.khandualoom.microservice.common.event;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentCompletedEvent(
    UUID eventId,
    Long orderId,
    String paymentId,
    String customerEmail,
    BigDecimal amount,
    String paymentMethod,
    String status,
    Instant timestamp
) implements Serializable {

    public static PaymentCompletedEvent create(
        Long orderId,
        String paymentId,
        String customerEmail,
        BigDecimal amount,
        String paymentMethod,
        String status
    ) {
        return new PaymentCompletedEvent(
            UUID.randomUUID(),
            orderId,
            paymentId,
            customerEmail,
            amount,
            paymentMethod,
            status,
            Instant.now()
        );
    }
}
