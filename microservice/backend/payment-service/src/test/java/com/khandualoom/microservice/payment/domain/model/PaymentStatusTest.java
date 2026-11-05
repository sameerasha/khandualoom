package com.khandualoom.microservice.payment.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PaymentStatusTest {

    @Test
    @DisplayName("Should allow valid forward transitions from CREATED to CAPTURED")
    void shouldAllowValidForwardTransitions() {
        Payment payment = Payment.builder()
                .id(UUID.randomUUID())
                .orderId(101L)
                .amount(new BigDecimal("15000.00"))
                .currency("INR")
                .status(PaymentStatus.CREATED)
                .build();

        payment.transitionTo(PaymentStatus.PENDING, null);
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.PENDING);

        payment.markAuthorized("pay_test_123", "sig_test_123");
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.AUTHORIZED);
        assertThat(payment.getRazorpayPaymentId()).isEqualTo("pay_test_123");

        payment.markCaptured("pay_test_123", "sig_test_123");
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.CAPTURED);
        assertThat(payment.getStatus().isSuccessful()).isTrue();
    }

    @Test
    @DisplayName("Should reject invalid transition from CAPTURED to FAILED")
    void shouldRejectTransitionFromCapturedToFailed() {
        Payment payment = Payment.builder()
                .id(UUID.randomUUID())
                .orderId(102L)
                .status(PaymentStatus.CAPTURED)
                .build();

        assertThatThrownBy(() -> payment.markFailed("Delayed failure event"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Invalid payment state transition from CAPTURED to FAILED");
    }

    @Test
    @DisplayName("Should support refund lifecycle from CAPTURED to REFUND_PENDING and REFUNDED")
    void shouldSupportRefundLifecycle() {
        Payment payment = Payment.builder()
                .id(UUID.randomUUID())
                .orderId(103L)
                .status(PaymentStatus.CAPTURED)
                .build();

        payment.initiateRefund("rfnd_test_001");
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.REFUND_PENDING);
        assertThat(payment.getRefundId()).isEqualTo("rfnd_test_001");
        assertThat(payment.getRefundStatus()).isEqualTo("INITIATED");

        payment.markRefunded("rfnd_test_001");
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.REFUNDED);
        assertThat(payment.getStatus().isTerminal()).isTrue();
    }

    @Test
    @DisplayName("Terminal states should reject any further transition")
    void terminalStatesShouldRejectTransitions() {
        Payment payment = Payment.builder()
                .id(UUID.randomUUID())
                .orderId(104L)
                .status(PaymentStatus.FAILED)
                .build();

        assertThat(payment.getStatus().isTerminal()).isTrue();
        assertThat(payment.getStatus().canTransitionTo(PaymentStatus.CAPTURED)).isFalse();

        assertThatThrownBy(() -> payment.transitionTo(PaymentStatus.CAPTURED, null))
                .isInstanceOf(IllegalStateException.class);
    }
}
