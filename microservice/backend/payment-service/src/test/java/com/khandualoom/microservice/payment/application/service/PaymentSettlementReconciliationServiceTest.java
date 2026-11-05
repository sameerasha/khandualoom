package com.khandualoom.microservice.payment.application.service;

import com.khandualoom.microservice.payment.domain.model.Payment;
import com.khandualoom.microservice.payment.domain.model.PaymentStatus;
import com.khandualoom.microservice.payment.domain.repository.PaymentRepository;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentSettlementLedgerJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.repository.PaymentSettlementLedgerRepository;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentSettlementReconciliationServiceTest {

    @Mock
    private PaymentSettlementLedgerRepository settlementRepository;

    @Mock
    private PaymentRepository paymentRepository;

    private PaymentSettlementReconciliationService reconciliationService;
    private SimpleMeterRegistry meterRegistry;

    @BeforeEach
    void setUp() {
        meterRegistry = new SimpleMeterRegistry();
        reconciliationService = new PaymentSettlementReconciliationService(
                settlementRepository,
                paymentRepository,
                meterRegistry,
                Optional.empty()
        );
    }

    @Test
    @DisplayName("Should successfully reconcile valid settlement item")
    void shouldReconcileValidSettlement() {
        String rzpPaymentId = "pay_settle_001";
        Payment payment = Payment.builder()
                .id(UUID.randomUUID())
                .orderId(8001L)
                .amount(new BigDecimal("10000.00"))
                .status(PaymentStatus.CAPTURED)
                .razorpayPaymentId(rzpPaymentId)
                .build();

        when(settlementRepository.findByRazorpaySettlementId("setl_001")).thenReturn(Optional.empty());
        when(paymentRepository.findByRazorpayPaymentId(rzpPaymentId)).thenReturn(Optional.of(payment));

        PaymentSettlementReconciliationService.SettlementItemRequest request =
                PaymentSettlementReconciliationService.SettlementItemRequest.builder()
                        .razorpaySettlementId("setl_001")
                        .razorpayPaymentId(rzpPaymentId)
                        .orderId(8001L)
                        .settlementUtr("UTR123456789")
                        .grossAmount(new BigDecimal("10000.00"))
                        .fee(new BigDecimal("200.00"))
                        .tax(new BigDecimal("36.00"))
                        .netAmount(new BigDecimal("9764.00"))
                        .settledAt(LocalDateTime.now())
                        .build();

        var result = reconciliationService.reconcileSettlementItem(request);

        assertThat(result.getStatus()).isEqualTo("SETTLED");
        assertThat(result.isDiscrepancy()).isFalse();

        ArgumentCaptor<PaymentSettlementLedgerJpaEntity> captor = ArgumentCaptor.forClass(PaymentSettlementLedgerJpaEntity.class);
        verify(settlementRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo("SETTLED");
        assertThat(captor.getValue().getSettlementUtr()).isEqualTo("UTR123456789");

        // Verify NO modification of payment state
        verify(paymentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should detect gross amount discrepancy and record DISCREPANCY status")
    void shouldDetectGrossDiscrepancy() {
        String rzpPaymentId = "pay_settle_002";
        Payment payment = Payment.builder()
                .id(UUID.randomUUID())
                .orderId(8002L)
                .amount(new BigDecimal("15000.00")) // Expected 15000
                .status(PaymentStatus.CAPTURED)
                .razorpayPaymentId(rzpPaymentId)
                .build();

        when(settlementRepository.findByRazorpaySettlementId("setl_002")).thenReturn(Optional.empty());
        when(paymentRepository.findByRazorpayPaymentId(rzpPaymentId)).thenReturn(Optional.of(payment));

        PaymentSettlementReconciliationService.SettlementItemRequest request =
                PaymentSettlementReconciliationService.SettlementItemRequest.builder()
                        .razorpaySettlementId("setl_002")
                        .razorpayPaymentId(rzpPaymentId)
                        .orderId(8002L)
                        .grossAmount(new BigDecimal("12000.00")) // Discrepancy!
                        .fee(new BigDecimal("200.00"))
                        .tax(new BigDecimal("36.00"))
                        .netAmount(new BigDecimal("11764.00"))
                        .build();

        var result = reconciliationService.reconcileSettlementItem(request);

        assertThat(result.getStatus()).isEqualTo("DISCREPANCY");
        assertThat(result.isDiscrepancy()).isTrue();
        assertThat(result.getMessage()).contains("Gross amount mismatch");
    }

    @Test
    @DisplayName("Should flag UNMATCHED when payment ID does not exist in local database")
    void shouldFlagUnmatchedPayment() {
        when(settlementRepository.findByRazorpaySettlementId("setl_003")).thenReturn(Optional.empty());
        when(paymentRepository.findByRazorpayPaymentId("pay_ghost")).thenReturn(Optional.empty());

        PaymentSettlementReconciliationService.SettlementItemRequest request =
                PaymentSettlementReconciliationService.SettlementItemRequest.builder()
                        .razorpaySettlementId("setl_003")
                        .razorpayPaymentId("pay_ghost")
                        .grossAmount(new BigDecimal("5000.00"))
                        .netAmount(new BigDecimal("4900.00"))
                        .build();

        var result = reconciliationService.reconcileSettlementItem(request);

        assertThat(result.getStatus()).isEqualTo("UNMATCHED");
        assertThat(result.isDiscrepancy()).isTrue();
    }
}
