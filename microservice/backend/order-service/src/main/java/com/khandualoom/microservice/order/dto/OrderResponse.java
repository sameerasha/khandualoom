package com.khandualoom.microservice.order.dto;

import com.khandualoom.microservice.order.model.OrderStatus;
import com.khandualoom.microservice.order.model.PaymentMethod;
import com.khandualoom.microservice.order.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private String city;
    private String state;
    private String pincode;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private LocalDateTime createdDate;
    private List<OrderItemResponse> items;
}
