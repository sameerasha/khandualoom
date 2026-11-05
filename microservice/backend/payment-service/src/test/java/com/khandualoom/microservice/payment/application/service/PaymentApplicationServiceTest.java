package com.khandualoom.microservice.payment.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.payment.application.dto.ObservationSource;
import com.khandualoom.microservice.payment.application.dto.PaymentObservationCommand;
import com.khandualoom.microservice.payment.application.dto.PaymentRequest;
import com.khandualoom.microservice.payment.application.dto.PaymentResponse;
import com.khandualoom.microservice.payment.domain.model.Payment;
import com.khandualoom.microservice.payment.domain.model.PaymentStatus;
import com.khandualoom.microservice.payment.domain.repository.PaymentRepository;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentOperationLedgerJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentOutboxJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.repository.PaymentOperationLedgerRepository;
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
class PaymentApplicationServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentOutboxRepository outboxRepository;

    @Mock
    private PaymentOperationLedgerRepository ledgerRepository;

    @Mock
    private RazorpayClientService razorpayClientService;

    private PaymentApplicationService paymentService;
    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @BeforeEach
    void setUp() {
        paymentService = new PaymentApplicationService(
                paymentRepository,
                outboxRepository,
                ledgerRepository,
                razorpayClientService,
                objectMapper
        );
    }

    @Test
    @DisplayName("Should create payment order and record ledger entry")
    void shouldCreatePaymentOrderAndRecordLedger() throws Exception {
        PaymentRequest request = PaymentRequest.builder()
                .orderId(5001L)
                .amount(new BigDecimal("12500.00"))
                .currency("INR")
                .idempotencyKey("idem-test-5001")
                .build();

        when(paymentRepository.findByIdempotencyKey("idem-test-5001")).thenReturn(Optional.empty());
        when(razorpayClientService.createRazorpayOrder(any(), eq("INR"), any())).thenReturn("order_rzp_5001");
        when(razorpayClientService.getKeyId()).thenReturn("rzp_test_key");
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PaymentResponse response = paymentService.createPaymentOrder(request);

        assertThat(response).isNotNull();
        assertThat(response.getOrderId()).isEqualTo("order_rzp_5001");
        assertThat(response.getStatus()).isEqualTo("created");

        // Verify ledger was saved twice (INITIATED then SUCCESS)
        verify(ledgerRepository, atLeast(2)).save(any(PaymentOperationLedgerJpaEntity.class));
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    @DisplayName("Should process authoritative refund.processed webhook")
    void shouldProcessAuthoritativeRefundProcessedWebhook() {
        String paymentId = "pay_test_7001";
        String refundId = "rfnd_test_7001";

        Payment payment = Payment.builder()
                .id(UUID.randomUUID())
                .orderId(7001L)
                .amount(new BigDecimal("9500.00"))
                .currency("INR")
                .status(PaymentStatus.REFUND_PENDING)
                .razorpayPaymentId(paymentId)
                .razorpayOrderId("order_rzp_7001")
                .build();

        when(paymentRepository.findByRazorpayPaymentId(paymentId)).thenReturn(Optional.of(payment));
        when(razorpayClientService.verifyWebhookSignature(any(), any(), any())).thenReturn(true);

        PaymentResponse response = paymentService.processRefundWebhook(
                refundId, paymentId, "processed", "evt_7001", "{}", "sig_7001");

        assertThat(response).isNotNull();
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.REFUNDED);
        assertThat(payment.getRefundId()).isEqualTo(refundId);

        verify(paymentRepository).save(payment);
        verify(ledgerRepository).save(any(PaymentOperationLedgerJpaEntity.class));
        verify(outboxRepository).save(any(PaymentOutboxJpaEntity.class));
    }

    @Test
    @DisplayName("Should process authoritative refund.failed webhook")
    void shouldProcessAuthoritativeRefundFailedWebhook() {
        String paymentId = "pay_test_7002";
        String refundId = "rfnd_test_7002";

        Payment payment = Payment.builder()
                .id(UUID.randomUUID())
                .orderId(7002L)
                .amount(new BigDecimal("14000.00"))
                .currency("INR")
                .status(PaymentStatus.REFUND_PENDING)
                .razorpayPaymentId(paymentId)
                .razorpayOrderId("order_rzp_7002")
                .build();

        when(paymentRepository.findByRazorpayPaymentId(paymentId)).thenReturn(Optional.of(payment));
        when(razorpayClientService.verifyWebhookSignature(any(), any(), any())).thenReturn(true);

        PaymentResponse response = paymentService.processRefundWebhook(
                refundId, paymentId, "failed", "evt_7002", "{}", "sig_7002");

        assertThat(response).isNotNull();
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.REFUND_FAILED);

        verify(paymentRepository).save(payment);
        verify(ledgerRepository).save(any(PaymentOperationLedgerJpaEntity.class));
        verify(outboxRepository).save(any(PaymentOutboxJpaEntity.class));
    }
}
