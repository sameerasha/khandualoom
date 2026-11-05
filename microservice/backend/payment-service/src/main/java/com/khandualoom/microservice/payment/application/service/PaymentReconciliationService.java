package com.khandualoom.microservice.payment.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.common.event.PaymentCompletedEvent;
import com.khandualoom.microservice.payment.domain.model.Payment;
import com.khandualoom.microservice.payment.domain.model.PaymentStatus;
import com.khandualoom.microservice.payment.domain.repository.PaymentRepository;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentOutboxJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.repository.PaymentOutboxRepository;
import com.khandualoom.microservice.payment.infrastructure.razorpay.RazorpayClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentReconciliationService {

    private final PaymentRepository paymentRepository;
    private final PaymentOutboxRepository outboxRepository;
    private final RazorpayClientService razorpayClientService;
    private final ObjectMapper objectMapper;

    /**
     * Reconciles payments that succeeded after the 15-minute inventory reservation expired.
     * If stock can safely be re-reserved, confirms the order.
     * Otherwise, initiates an automated Razorpay refund, tracks refund status, and emits events for customer notification and audit.
     *
     * @param orderId              The internal order ID
     * @param stockAvailableForReorder true if inventory can be re-reserved; false if stock was sold to someone else
     */
    @Transactional
    public String reconcileLatePayment(Long orderId, boolean stockAvailableForReorder) {
        log.info("Starting late payment reconciliation for order #{}", orderId);

        Optional<Payment> paymentOpt = paymentRepository.findByOrderId(orderId);
        if (paymentOpt.isEmpty()) {
            log.warn("Reconciliation failed: No payment record found for order #{}", orderId);
            return "NO_PAYMENT_FOUND";
        }

        Payment payment = paymentOpt.get();

        if (payment.getStatus() != PaymentStatus.CAPTURED) {
            log.info("Payment #{} status is {}. No reconciliation needed.", payment.getId(), payment.getStatus());
            return "PAYMENT_NOT_CAPTURED";
        }

        if (stockAvailableForReorder) {
            log.info("Stock is available for re-order. Recovering order #{} following late payment capture.", orderId);
            PaymentCompletedEvent recoveryEvent = PaymentCompletedEvent.create(
                    payment.getOrderId(),
                    payment.getRazorpayPaymentId(),
                    payment.getRazorpayOrderId(),
                    payment.getAmount(),
                    payment.getPaymentMethod(),
                    "RECOVERED_SUCCESS"
            );
            saveOutboxEvent("payment-completed", String.valueOf(orderId), recoveryEvent);
            return "ORDER_RECOVERED";
        } else {
            log.warn("Inventory reservation expired and stock unavailable for order #{}. Initiating automated refund.", orderId);
            try {
                BigDecimal amountInPaise = payment.getAmount().multiply(new BigDecimal("100"));
                String refundId = razorpayClientService.refundPayment(payment.getRazorpayPaymentId(), amountInPaise);

                payment.markRefunded(refundId);
                paymentRepository.save(payment);

                // Publish refund event to outbox for Notification and Audit consumers
                PaymentRefundEvent refundEvent = new PaymentRefundEvent(
                        payment.getOrderId(),
                        payment.getRazorpayPaymentId(),
                        refundId,
                        payment.getAmount(),
                        "INVENTORY_EXPIRED_REFUND"
                );
                saveOutboxEvent("payments.refund-processed", String.valueOf(orderId), refundEvent);

                log.info("Automated refund initiated: refundId={}, orderId={}", refundId, orderId);
                return "REFUND_INITIATED";
            } catch (Exception e) {
                log.error("Failed to execute refund for order #{}: {}", orderId, e.getMessage(), e);
                payment.transitionTo(PaymentStatus.REFUND_PENDING, "Refund API failed: " + e.getMessage());
                paymentRepository.save(payment);
                return "REFUND_FAILED";
            }
        }
    }

    private void saveOutboxEvent(String eventType, String aggregateId, Object payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            PaymentOutboxJpaEntity outbox = new PaymentOutboxJpaEntity("Payment", aggregateId, eventType, json);
            outboxRepository.save(outbox);
        } catch (Exception e) {
            log.error("Failed to save outbox event for {}: {}", eventType, e.getMessage());
        }
    }

    public record PaymentRefundEvent(Long orderId, String paymentId, String refundId, BigDecimal amount, String reason) {}
}
