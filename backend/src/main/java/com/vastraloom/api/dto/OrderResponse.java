package com.vastraloom.api.dto;

import com.vastraloom.api.model.Address;
import com.vastraloom.api.model.OrderStatus;
import com.vastraloom.api.model.PaymentMethod;
import com.vastraloom.api.model.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private Address address;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
    
    // For admin view, maybe we need the user's name/email, but we can just include basic user info
    private UserBasicInfo user;
}
