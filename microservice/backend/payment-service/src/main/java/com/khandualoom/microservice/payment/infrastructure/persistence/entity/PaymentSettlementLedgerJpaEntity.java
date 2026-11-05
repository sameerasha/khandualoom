package com.khandualoom.microservice.payment.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment_settlement_ledger")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentSettlementLedgerJpaEntity {

    @Id
    @Column(name = "settlement_id", nullable = false)
    private UUID settlementId;

    @Column(name = "razorpay_settlement_id", nullable = false, length = 128)
    private String razorpaySettlementId;

    @Column(name = "razorpay_payment_id", length = 128)
    private String razorpayPaymentId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "settlement_utr", length = 128)
    private String settlementUtr;

    @Column(name = "gross_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal grossAmount;

    @Column(name = "fee", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal fee = BigDecimal.ZERO;

    @Column(name = "tax", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal tax = BigDecimal.ZERO;

    @Column(name = "net_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal netAmount;

    @Column(name = "currency", nullable = false, length = 16)
    @Builder.Default
    private String currency = "INR";

    @Column(name = "status", nullable = false, length = 32)
    private String status; // SETTLED, DISCREPANCY, UNMATCHED

    @Column(name = "discrepancy_reason", columnDefinition = "TEXT")
    private String discrepancyReason;

    @Column(name = "settled_at")
    private LocalDateTime settledAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
