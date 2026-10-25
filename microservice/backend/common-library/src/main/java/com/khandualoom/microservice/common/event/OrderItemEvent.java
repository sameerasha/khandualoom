package com.khandualoom.microservice.common.event;

import java.io.Serializable;
import java.math.BigDecimal;

public record OrderItemEvent(
    Long productId,
    String productName,
    Integer quantity,
    BigDecimal price,
    String imageUrl
) implements Serializable {}
