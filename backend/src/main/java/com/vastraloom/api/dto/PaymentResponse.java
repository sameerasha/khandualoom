package com.vastraloom.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentResponse {
    private String orderId;
    private String amount;
    private String currency;
    private String key;
    private String status;
    private String receipt;
}
