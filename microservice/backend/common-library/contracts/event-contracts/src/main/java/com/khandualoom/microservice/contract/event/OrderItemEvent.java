package com.khandualoom.microservice.contract.event;

import java.io.Serializable;
import java.math.BigDecimal;

public record OrderItemEvent(
    Long productId,
    String productName,
    Integer quantity,
    BigDecimal price,
    String productImage
) implements Serializable {}
