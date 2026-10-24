package com.vastraloom.microservice.order.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentRequest {
    private BigDecimal amount;
    private String currency = "INR";
}

