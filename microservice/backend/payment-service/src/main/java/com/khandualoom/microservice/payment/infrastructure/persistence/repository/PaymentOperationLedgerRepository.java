package com.khandualoom.microservice.payment.infrastructure.persistence.repository;

import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentOperationLedgerJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentOperationLedgerRepository extends JpaRepository<PaymentOperationLedgerJpaEntity, UUID> {
    Optional<PaymentOperationLedgerJpaEntity> findByIdempotencyKey(String idempotencyKey);
    Optional<PaymentOperationLedgerJpaEntity> findByRazorpayOrderIdAndOperationType(String razorpayOrderId, String operationType);
    Optional<PaymentOperationLedgerJpaEntity> findByRazorpayPaymentIdAndOperationType(String razorpayPaymentId, String operationType);
    List<PaymentOperationLedgerJpaEntity> findByOrderId(Long orderId);
}
