package com.khandualoom.microservice.payment.application.dto;

import com.khandualoom.microservice.payment.domain.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentObservationCommand {

    private Long orderId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private String webhookEventId;
    private ObservationSource source;
    private PaymentStatus observedStatus;
    private String rawPayload;
    private BigDecimal amount;
    private String currency;
    private String failureReason;
}
