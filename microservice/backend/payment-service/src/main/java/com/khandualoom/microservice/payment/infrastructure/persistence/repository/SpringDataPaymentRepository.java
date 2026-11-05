package com.khandualoom.microservice.payment.infrastructure.persistence.repository;

import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpringDataPaymentRepository extends JpaRepository<PaymentJpaEntity, UUID> {
    Optional<PaymentJpaEntity> findByOrderId(Long orderId);
    Optional<PaymentJpaEntity> findByRazorpayOrderId(String razorpayOrderId);
    Optional<PaymentJpaEntity> findByRazorpayPaymentId(String razorpayPaymentId);
    Optional<PaymentJpaEntity> findByWebhookEventId(String webhookEventId);
    Optional<PaymentJpaEntity> findByIdempotencyKey(String idempotencyKey);
}
