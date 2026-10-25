package com.khandualoom.microservice.common.event;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrderCreatedEvent(
    UUID eventId,
    Long orderId,
    Long userId,
    String customerEmail,
    String customerPhone,
    BigDecimal totalAmount,
    String shippingAddress,
    String city,
    String state,
    String pincode,
    List<OrderItemEvent> items,
    Instant timestamp
) implements Serializable {

    public static OrderCreatedEvent create(
        Long orderId,
        Long userId,
        String customerEmail,
        String customerPhone,
        BigDecimal totalAmount,
        String shippingAddress,
        String city,
        String state,
        String pincode,
        List<OrderItemEvent> items
    ) {
        return new OrderCreatedEvent(
            UUID.randomUUID(),
            orderId,
            userId,
            customerEmail,
            customerPhone,
            totalAmount,
            shippingAddress,
            city,
            state,
            pincode,
            items,
            Instant.now()
        );
    }
}
