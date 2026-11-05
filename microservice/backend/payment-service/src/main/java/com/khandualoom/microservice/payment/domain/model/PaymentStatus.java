package com.khandualoom.microservice.payment.domain.model;

public enum PaymentStatus {
    CREATED,
    PENDING,
    AUTHORIZED,
    CAPTURED,
    FAILED,
    CANCELLED,
    REFUND_PENDING,
    REFUNDED;

    public boolean canTransitionTo(PaymentStatus next) {
        if (this == next) {
            return true;
        }
        return switch (this) {
            case CREATED -> next == PENDING || next == AUTHORIZED || next == CAPTURED || next == FAILED || next == CANCELLED;
            case PENDING -> next == AUTHORIZED || next == CAPTURED || next == FAILED || next == CANCELLED;
            case AUTHORIZED -> next == CAPTURED || next == FAILED || next == CANCELLED;
            case CAPTURED -> next == REFUND_PENDING || next == REFUNDED;
            case REFUND_PENDING -> next == REFUNDED || next == CAPTURED; // refund failure reverts to CAPTURED
            case FAILED, CANCELLED, REFUNDED -> false; // Terminal states
        };
    }

    public boolean isTerminal() {
        return this == FAILED || this == CANCELLED || this == REFUNDED;
    }

    public boolean isSuccessful() {
        return this == CAPTURED || this == REFUND_PENDING || this == REFUNDED;
    }
}
