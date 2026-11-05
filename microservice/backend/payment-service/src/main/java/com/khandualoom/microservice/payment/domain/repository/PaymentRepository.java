package com.khandualoom.microservice.payment.domain.repository;

import com.khandualoom.microservice.payment.domain.model.Payment;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository {
    Payment save(Payment payment);
    Optional<Payment> findById(UUID id);
    Optional<Payment> findByOrderId(Long orderId);
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
    Optional<Payment> findByWebhookEventId(String webhookEventId);
    Optional<Payment> findByIdempotencyKey(String idempotencyKey);
}
