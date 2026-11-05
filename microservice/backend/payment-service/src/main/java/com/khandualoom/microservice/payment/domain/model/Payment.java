package com.khandualoom.microservice.payment.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    private UUID id;
    private Long orderId;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String paymentMethod;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private String webhookEventId;
    private String idempotencyKey;
    private String failureReason;
    private String refundId;
    private String refundStatus;
    private Long version;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

    public void transitionTo(PaymentStatus nextStatus, String reason) {
        if (!this.status.canTransitionTo(nextStatus)) {
            throw new IllegalStateException("Invalid payment state transition from " + this.status + " to " + nextStatus);
        }
        this.status = nextStatus;
        if (reason != null) {
            this.failureReason = reason;
        }
        this.modifiedDate = LocalDateTime.now();
    }

    public void markAuthorized(String paymentId, String signature) {
        transitionTo(PaymentStatus.AUTHORIZED, null);
        this.razorpayPaymentId = paymentId;
        this.razorpaySignature = signature;
    }

    public void markCaptured(String paymentId, String signature) {
        transitionTo(PaymentStatus.CAPTURED, null);
        this.razorpayPaymentId = paymentId;
        this.razorpaySignature = signature;
    }

    public void markFailed(String reason) {
        transitionTo(PaymentStatus.FAILED, reason);
    }

    public void markCancelled(String reason) {
        transitionTo(PaymentStatus.CANCELLED, reason);
    }

    public void initiateRefund(String refundId) {
        transitionTo(PaymentStatus.REFUND_PENDING, null);
        this.refundId = refundId;
        this.refundStatus = "INITIATED";
    }

    public void markRefunded(String refundId) {
        transitionTo(PaymentStatus.REFUNDED, null);
        this.refundId = refundId;
        this.refundStatus = "PROCESSED";
    }

    public void markRefundFailed(String reason) {
        transitionTo(PaymentStatus.REFUND_FAILED, reason);
        this.refundStatus = "FAILED";
    }
}
