package com.khandualoom.microservice.payment.infrastructure.persistence.repository;

import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentSettlementLedgerJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentSettlementLedgerRepository extends JpaRepository<PaymentSettlementLedgerJpaEntity, UUID> {
    Optional<PaymentSettlementLedgerJpaEntity> findByRazorpaySettlementId(String razorpaySettlementId);
    Optional<PaymentSettlementLedgerJpaEntity> findByRazorpayPaymentId(String razorpayPaymentId);
}
