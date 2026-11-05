package com.khandualoom.microservice.payment.application.service;

import com.khandualoom.microservice.payment.domain.model.Payment;
import com.khandualoom.microservice.payment.domain.repository.PaymentRepository;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentSettlementLedgerJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.repository.PaymentSettlementLedgerRepository;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Enterprise Financial Reconciliation Service.
 * Ingests and authoritatively verifies Razorpay settlement batches against captured payments.
 * Tracks gross, fee, GST/tax, net amounts, and settlement UTRs.
 * INVARIANT: Settlement mismatches NEVER alter order or inventory status directly.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentSettlementReconciliationService {

    private final PaymentSettlementLedgerRepository settlementRepository;
    private final PaymentRepository paymentRepository;
    private final MeterRegistry meterRegistry;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SettlementItemRequest {
        private String razorpaySettlementId;
        private String razorpayPaymentId;
        private Long orderId;
        private String settlementUtr;
        private BigDecimal grossAmount;
        private BigDecimal fee;
        private BigDecimal tax;
        private BigDecimal netAmount;
        private String currency;
        private LocalDateTime settledAt;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class SettlementReconciliationResult {
        private UUID settlementId;
        private String status;
        private String message;
        private boolean isDiscrepancy;
    }

    @Transactional
    public SettlementReconciliationResult reconcileSettlementItem(SettlementItemRequest request) {
        log.info("Reconciling settlement item: rzpSettlementId={}, paymentId={}, gross={}",
                request.getRazorpaySettlementId(), request.getRazorpayPaymentId(), request.getGrossAmount());

        // 1. Idempotency: Return existing settlement entry if already ingested
        Optional<PaymentSettlementLedgerJpaEntity> existing = settlementRepository.findByRazorpaySettlementId(request.getRazorpaySettlementId());
        if (existing.isPresent()) {
            PaymentSettlementLedgerJpaEntity entity = existing.get();
            log.info("Duplicate settlement import acknowledged: {}", request.getRazorpaySettlementId());
            return new SettlementReconciliationResult(
                    entity.getSettlementId(),
                    entity.getStatus(),
                    "Duplicate settlement acknowledged: already processed",
                    "DISCREPANCY".equalsIgnoreCase(entity.getStatus())
            );
        }

        UUID settlementId = UUID.randomUUID();
        String status = "SETTLED";
        String discrepancyReason = null;
        Long orderId = request.getOrderId();

        // 2. Lookup matching payment record
        Optional<Payment> paymentOpt = Optional.empty();
        if (request.getRazorpayPaymentId() != null && !request.getRazorpayPaymentId().isBlank()) {
            paymentOpt = paymentRepository.findByRazorpayPaymentId(request.getRazorpayPaymentId());
        }
        if (paymentOpt.isEmpty() && orderId != null && orderId > 0) {
            paymentOpt = paymentRepository.findByOrderId(orderId);
        }

        if (paymentOpt.isEmpty()) {
            log.warn("Settlement UNMATCHED: No payment found for gateway payment ID [{}]", request.getRazorpayPaymentId());
            status = "UNMATCHED";
            discrepancyReason = "No matching payment record found for gateway payment ID";
            meterRegistry.counter("khandualoom.reconciliation.unmatched").increment();
        } else {
            Payment payment = paymentOpt.get();
            orderId = payment.getOrderId();

            // Verify Gross Amount matches original payment amount
            if (request.getGrossAmount() != null && payment.getAmount() != null) {
                if (request.getGrossAmount().compareTo(payment.getAmount()) != 0) {
                    status = "DISCREPANCY";
                    discrepancyReason = "Gross amount mismatch: payment was " + payment.getAmount() + ", settlement gross was " + request.getGrossAmount();
                    log.error("Settlement DISCREPANCY for order #{}: {}", orderId, discrepancyReason);
                    meterRegistry.counter("khandualoom.reconciliation.discrepancy", "type", "gross_mismatch").increment();
                }
            }

            // Verify Fee + Tax + Net = Gross arithmetic
            BigDecimal fee = request.getFee() != null ? request.getFee() : BigDecimal.ZERO;
            BigDecimal tax = request.getTax() != null ? request.getTax() : BigDecimal.ZERO;
            BigDecimal net = request.getNetAmount() != null ? request.getNetAmount() : BigDecimal.ZERO;
            BigDecimal gross = request.getGrossAmount() != null ? request.getGrossAmount() : BigDecimal.ZERO;

            BigDecimal expectedNet = gross.subtract(fee).subtract(tax);
            if (expectedNet.compareTo(net) != 0 && !"DISCREPANCY".equals(status)) {
                status = "DISCREPANCY";
                discrepancyReason = "Net calculation mismatch: gross - fee - tax = " + expectedNet + ", reported net = " + net;
                log.error("Settlement DISCREPANCY: {}", discrepancyReason);
                meterRegistry.counter("khandualoom.reconciliation.discrepancy", "type", "net_calculation_error").increment();
            }
        }

        if ("SETTLED".equals(status)) {
            meterRegistry.counter("khandualoom.reconciliation.settled").increment();
        }

        // Persist settlement audit ledger
        PaymentSettlementLedgerJpaEntity ledgerEntry = PaymentSettlementLedgerJpaEntity.builder()
                .settlementId(settlementId)
                .razorpaySettlementId(request.getRazorpaySettlementId())
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .orderId(orderId)
                .settlementUtr(request.getSettlementUtr())
                .grossAmount(request.getGrossAmount())
                .fee(request.getFee() != null ? request.getFee() : BigDecimal.ZERO)
                .tax(request.getTax() != null ? request.getTax() : BigDecimal.ZERO)
                .netAmount(request.getNetAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .status(status)
                .discrepancyReason(discrepancyReason)
                .settledAt(request.getSettledAt() != null ? request.getSettledAt() : LocalDateTime.now())
                .build();

        settlementRepository.save(ledgerEntry);
        log.info("Saved settlement ledger entry #{} with status [{}]", settlementId, status);

        return new SettlementReconciliationResult(
                settlementId,
                status,
                discrepancyReason != null ? discrepancyReason : "Settlement successfully reconciled",
                "DISCREPANCY".equals(status) || "UNMATCHED".equals(status)
        );
    }
}
