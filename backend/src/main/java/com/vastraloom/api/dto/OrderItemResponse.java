package com.vastraloom.api.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productCategory;
    private String productImageUrl;
    private Integer quantity;
    private BigDecimal priceAtTime;
}
