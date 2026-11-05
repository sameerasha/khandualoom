package com.khandualoom.microservice.payment.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment_operation_ledger")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOperationLedgerJpaEntity {

    @Id
    @Column(name = "operation_id", nullable = false)
    private UUID operationId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "razorpay_order_id", length = 128)
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id", length = 128)
    private String razorpayPaymentId;

    @Column(name = "idempotency_key", length = 128)
    private String idempotencyKey;

    @Column(name = "operation_type", nullable = false, length = 64)
    private String operationType;

    @Column(name = "request_hash", length = 64)
    private String requestHash;

    @Column(name = "status", nullable = false, length = 32)
    private String status;

    @Column(name = "gateway_reference", length = 128)
    private String gatewayReference;

    @Column(name = "gateway_response", columnDefinition = "TEXT")
    private String gatewayResponse;

    @Column(name = "retry_count", nullable = false)
    @Builder.Default
    private Integer retryCount = 0;

    @Column(name = "last_reconciled_at")
    private LocalDateTime lastReconciledAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
