package com.vastraloom.api.dto;

import com.vastraloom.api.model.PaymentMethod;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private Long addressId;
    private PaymentMethod paymentMethod;
    private List<OrderItemRequest> items;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
