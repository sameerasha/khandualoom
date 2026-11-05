package com.khandualoom.microservice.payment.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.payment.domain.model.Payment;
import com.khandualoom.microservice.payment.domain.model.PaymentStatus;
import com.khandualoom.microservice.payment.domain.repository.PaymentRepository;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentOutboxJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.repository.PaymentOutboxRepository;
import com.khandualoom.microservice.payment.infrastructure.razorpay.RazorpayClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentReconciliationServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentOutboxRepository outboxRepository;

    @Mock
    private RazorpayClientService razorpayClientService;

    private PaymentReconciliationService reconciliationService;
    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @BeforeEach
    void setUp() {
        reconciliationService = new PaymentReconciliationService(
                paymentRepository,
                outboxRepository,
                razorpayClientService,
                objectMapper
        );
    }

    @Test
    @DisplayName("Should recover order when stock is available for re-order after late payment capture")
    void shouldRecoverOrderWhenStockIsAvailable() {
        Long orderId = 2001L;
        Payment payment = Payment.builder()
                .id(UUID.randomUUID())
                .orderId(orderId)
                .amount(new BigDecimal("18500.00"))
                .currency("INR")
                .status(PaymentStatus.CAPTURED)
                .razorpayPaymentId("pay_late_123")
                .razorpayOrderId("order_late_123")
                .paymentMethod("RAZORPAY")
                .build();

        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.of(payment));

        String outcome = reconciliationService.reconcileLatePayment(orderId, true);

        assertThat(outcome).isEqualTo("ORDER_RECOVERED");
        verify(outboxRepository).save(any(PaymentOutboxJpaEntity.class));
        verifyNoInteractions(razorpayClientService);
    }

    @Test
    @DisplayName("Should initiate automated refund when reservation expired and stock is unavailable")
    void shouldInitiateRefundWhenStockIsUnavailable() throws Exception {
        Long orderId = 2002L;
        Payment payment = Payment.builder()
                .id(UUID.randomUUID())
                .orderId(orderId)
                .amount(new BigDecimal("22000.00"))
                .currency("INR")
                .status(PaymentStatus.CAPTURED)
                .razorpayPaymentId("pay_late_456")
                .razorpayOrderId("order_late_456")
                .paymentMethod("RAZORPAY")
                .build();

        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.of(payment));
        when(razorpayClientService.refundPayment(eq("pay_late_456"), any(BigDecimal.class)))
                .thenReturn("rfnd_auto_999");

        String outcome = reconciliationService.reconcileLatePayment(orderId, false);

        assertThat(outcome).isEqualTo("REFUND_INITIATED");

        // Verify state transition to REFUNDED
        ArgumentCaptor<Payment> paymentCaptor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(paymentCaptor.capture());
        Payment saved = paymentCaptor.getValue();
        assertThat(saved.getStatus()).isEqualTo(PaymentStatus.REFUNDED);
        assertThat(saved.getRefundId()).isEqualTo("rfnd_auto_999");

        // Verify outbox event created for notification and audit
        ArgumentCaptor<PaymentOutboxJpaEntity> outboxCaptor = ArgumentCaptor.forClass(PaymentOutboxJpaEntity.class);
        verify(outboxRepository).save(outboxCaptor.capture());
        assertThat(outboxCaptor.getValue().getEventType()).isEqualTo("payments.refund-processed");
    }
}
