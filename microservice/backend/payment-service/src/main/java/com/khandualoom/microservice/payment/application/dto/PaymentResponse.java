package com.khandualoom.microservice.payment.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String orderId;
    private String amount;
    private String currency;
    private String key;
    private String status;
    private String receipt;
    private String message;
}
