package com.khandualoom.microservice.contract.event;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentCompletedEvent(
    UUID eventId,
    Long orderId,
    String paymentId,
    String razorpayOrderId,
    BigDecimal amount,
    String paymentMethod,
    String paymentStatus,
    Instant timestamp
) implements Serializable {

    public static PaymentCompletedEvent create(
        Long orderId,
        String paymentId,
        String razorpayOrderId,
        BigDecimal amount,
        String paymentMethod,
        String paymentStatus
    ) {
        return new PaymentCompletedEvent(
            UUID.randomUUID(),
            orderId,
            paymentId,
            razorpayOrderId,
            amount,
            paymentMethod,
            paymentStatus,
            Instant.now()
        );
    }
}
