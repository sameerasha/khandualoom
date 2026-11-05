package com.khandualoom.microservice.payment.infrastructure.persistence.adapter;

import com.khandualoom.microservice.payment.domain.model.Payment;
import com.khandualoom.microservice.payment.domain.model.PaymentStatus;
import com.khandualoom.microservice.payment.domain.repository.PaymentRepository;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.repository.SpringDataPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PaymentPersistenceAdapter implements PaymentRepository {

    private final SpringDataPaymentRepository repository;

    @Override
    public Payment save(Payment domain) {
        PaymentJpaEntity entity = toEntity(domain);
        PaymentJpaEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Payment> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Payment> findByOrderId(Long orderId) {
        return repository.findByOrderId(orderId).map(this::toDomain);
    }

    @Override
    public Optional<Payment> findByRazorpayOrderId(String razorpayOrderId) {
        return repository.findByRazorpayOrderId(razorpayOrderId).map(this::toDomain);
    }

    @Override
    public Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId) {
        return repository.findByRazorpayPaymentId(razorpayPaymentId).map(this::toDomain);
    }

    @Override
    public Optional<Payment> findByWebhookEventId(String webhookEventId) {
        return repository.findByWebhookEventId(webhookEventId).map(this::toDomain);
    }

    @Override
    public Optional<Payment> findByIdempotencyKey(String idempotencyKey) {
        return repository.findByIdempotencyKey(idempotencyKey).map(this::toDomain);
    }

    private Payment toDomain(PaymentJpaEntity entity) {
        return Payment.builder()
                .id(entity.getId())
                .orderId(entity.getOrderId())
                .amount(entity.getAmount())
                .currency(entity.getCurrency())
                .status(entity.getStatus())
                .paymentMethod(entity.getPaymentMethod())
                .razorpayOrderId(entity.getRazorpayOrderId())
                .razorpayPaymentId(entity.getRazorpayPaymentId())
                .razorpaySignature(entity.getRazorpaySignature())
                .webhookEventId(entity.getWebhookEventId())
                .idempotencyKey(entity.getIdempotencyKey())
                .failureReason(entity.getFailureReason())
                .refundId(entity.getRefundId())
                .refundStatus(entity.getRefundStatus())
                .version(entity.getVersion())
                .createdDate(entity.getCreatedDate())
                .modifiedDate(entity.getModifiedDate())
                .build();
    }

    private PaymentJpaEntity toEntity(Payment domain) {
        return PaymentJpaEntity.builder()
                .id(domain.getId() != null ? domain.getId() : UUID.randomUUID())
                .orderId(domain.getOrderId())
                .amount(domain.getAmount())
                .currency(domain.getCurrency() != null ? domain.getCurrency() : "INR")
                .status(domain.getStatus() != null ? domain.getStatus() : PaymentStatus.CREATED)
                .paymentMethod(domain.getPaymentMethod() != null ? domain.getPaymentMethod() : "RAZORPAY")
                .razorpayOrderId(domain.getRazorpayOrderId())
                .razorpayPaymentId(domain.getRazorpayPaymentId())
                .razorpaySignature(domain.getRazorpaySignature())
                .webhookEventId(domain.getWebhookEventId())
                .idempotencyKey(domain.getIdempotencyKey())
                .failureReason(domain.getFailureReason())
                .refundId(domain.getRefundId())
                .refundStatus(domain.getRefundStatus())
                .version(domain.getVersion())
                .createdDate(domain.getCreatedDate())
                .modifiedDate(domain.getModifiedDate())
                .build();
    }
}
