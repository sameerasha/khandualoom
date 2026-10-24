package com.vastraloom.microservice.order.dto;

import com.vastraloom.microservice.order.model.PaymentMethod;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long addressId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private String city;
    private String state;
    private String pincode;
    private PaymentMethod paymentMethod;
    private List<OrderItemRequest> items;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
