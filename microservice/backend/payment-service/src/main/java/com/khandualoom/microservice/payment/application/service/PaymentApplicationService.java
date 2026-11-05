package com.khandualoom.microservice.payment.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.common.event.PaymentCompletedEvent;
import com.khandualoom.microservice.contract.event.PaymentFailedEvent;
import com.khandualoom.microservice.payment.application.dto.*;
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
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentApplicationService {

    private final PaymentRepository paymentRepository;
    private final PaymentOutboxRepository outboxRepository;
    private final RazorpayClientService razorpayClientService;
    private final ObjectMapper objectMapper;

    @Transactional
    public PaymentResponse createPaymentOrder(PaymentRequest request) {
        // Idempotency check via idempotency key
        if (request.getIdempotencyKey() != null && !request.getIdempotencyKey().isBlank()) {
            Optional<Payment> existing = paymentRepository.findByIdempotencyKey(request.getIdempotencyKey());
            if (existing.isPresent()) {
                Payment p = existing.get();
                log.info("Idempotent replay for key: {}", request.getIdempotencyKey());
                return toResponse(p, "Idempotent payment retrieved");
            }
        }

        String receipt = "rcpt_" + UUID.randomUUID().toString().substring(0, 8);
        BigDecimal amountInPaise = request.getAmount().multiply(new BigDecimal("100"));

        try {
            String razorpayOrderId = razorpayClientService.createRazorpayOrder(amountInPaise, request.getCurrency(), receipt);

            Payment payment = Payment.builder()
                    .id(UUID.randomUUID())
                    .orderId(request.getOrderId() != null ? request.getOrderId() : 0L)
                    .amount(request.getAmount())
                    .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                    .status(PaymentStatus.CREATED)
                    .paymentMethod("RAZORPAY")
                    .razorpayOrderId(razorpayOrderId)
                    .idempotencyKey(request.getIdempotencyKey())
                    .build();

            Payment saved = paymentRepository.save(payment);
            log.info("Payment order initiated: paymentId={}, razorpayOrderId={}", saved.getId(), razorpayOrderId);

            return PaymentResponse.builder()
                    .orderId(razorpayOrderId)
                    .amount(amountInPaise.toBigInteger().toString())
                    .currency(payment.getCurrency())
                    .key(razorpayClientService.getKeyId())
                    .status("created")
                    .receipt(receipt)
                    .message("Razorpay payment order created")
                    .build();
        } catch (Exception e) {
            log.error("Failed to create Razorpay order: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create payment order: " + e.getMessage(), e);
        }
    }

    /**
     * Unified payment observation processor called by both REST verification and Razorpay Webhook callbacks.
     */
    @Transactional
    public PaymentResponse recordPaymentObservation(PaymentObservationCommand command) {
        log.info("Recording payment observation from source [{}]: razorpayOrderId={}, paymentId={}, status={}",
                command.getSource(), command.getRazorpayOrderId(), command.getRazorpayPaymentId(), command.getObservedStatus());

        // 1. Idempotency Check on Webhook Event ID
        if (command.getWebhookEventId() != null && !command.getWebhookEventId().isBlank()) {
            Optional<Payment> existingWebhook = paymentRepository.findByWebhookEventId(command.getWebhookEventId());
            if (existingWebhook.isPresent()) {
                log.info("Duplicate webhook event [{}] already processed for order [{}]",
                        command.getWebhookEventId(), existingWebhook.get().getOrderId());
                return toResponse(existingWebhook.get(), "Duplicate webhook event acknowledged");
            }
        }

        // 2. Lookup existing payment record
        Optional<Payment> paymentOpt = Optional.empty();
        if (command.getRazorpayOrderId() != null && !command.getRazorpayOrderId().isBlank()) {
            paymentOpt = paymentRepository.findByRazorpayOrderId(command.getRazorpayOrderId());
        }
        if (paymentOpt.isEmpty() && command.getOrderId() != null && command.getOrderId() > 0) {
            paymentOpt = paymentRepository.findByOrderId(command.getOrderId());
        }

        if (paymentOpt.isEmpty()) {
            log.warn("Payment record not found for Razorpay order [{}] or Order [{}]",
                    command.getRazorpayOrderId(), command.getOrderId());
            return PaymentResponse.builder()
                    .orderId(command.getRazorpayOrderId())
                    .status("not_found")
                    .message("Payment record not found")
                    .build();
        }

        Payment payment = paymentOpt.get();

        // 3. Concurrency / State Protection: Prevent delayed failure from overwriting captured payment
        if (payment.getStatus().isSuccessful() && command.getObservedStatus() == PaymentStatus.FAILED) {
            log.warn("Ignoring delayed FAILED observation for already captured payment #{} (Razorpay Order: {})",
                    payment.getId(), payment.getRazorpayOrderId());
            return toResponse(payment, "Ignored late failure for captured payment");
        }

        // 4. If already captured and duplicate verification arrives
        if (payment.getStatus() == PaymentStatus.CAPTURED && command.getObservedStatus() == PaymentStatus.CAPTURED) {
            log.info("Payment #{} is already CAPTURED. Returning idempotent confirmation.", payment.getId());
            return toResponse(payment, "Payment already captured");
        }

        // 5. Signature Verification with Constant-Time Equality Check
        boolean signatureValid = false;
        if (command.getSource() == ObservationSource.REST_CHECKOUT) {
            signatureValid = razorpayClientService.verifySignature(
                    command.getRazorpayOrderId(),
                    command.getRazorpayPaymentId(),
                    command.getRazorpaySignature()
            );
        } else if (command.getSource() == ObservationSource.WEBHOOK) {
            signatureValid = razorpayClientService.verifyWebhookSignature(
                    command.getRawPayload(),
                    command.getRazorpaySignature(),
                    null
            );
        } else if (command.getSource() == ObservationSource.RECONCILIATION) {
            signatureValid = true;
        }

        if (!signatureValid) {
            log.error("Signature verification failed for payment [{}] from source [{}]",
                    payment.getId(), command.getSource());
            payment.markFailed("Signature verification failed");
            paymentRepository.save(payment);

            publishOutboxEvent("payments.payment-failed", String.valueOf(payment.getOrderId()),
                    PaymentFailedEvent.of(payment.getOrderId(), command.getRazorpayPaymentId(), payment.getAmount(), "Signature verification failed"));

            return PaymentResponse.builder()
                    .orderId(payment.getRazorpayOrderId())
                    .status("failed")
                    .message("Payment signature mismatch")
                    .build();
        }

        // 6. Validate Amount and Currency
        if (command.getAmount() != null && payment.getAmount() != null) {
            if (command.getAmount().compareTo(payment.getAmount()) != 0) {
                log.error("Payment amount mismatch for order {}: expected {}, received {}",
                        payment.getOrderId(), payment.getAmount(), command.getAmount());
                payment.markFailed("Amount mismatch");
                paymentRepository.save(payment);

                publishOutboxEvent("payments.payment-failed", String.valueOf(payment.getOrderId()),
                        PaymentFailedEvent.of(payment.getOrderId(), command.getRazorpayPaymentId(), command.getAmount(), "Amount mismatch"));

                return PaymentResponse.builder()
                        .orderId(payment.getRazorpayOrderId())
                        .status("failed")
                        .message("Payment amount mismatch")
                        .build();
            }
        }

        // 7. Execute State Transition & Persist via Transactional Outbox
        if (command.getObservedStatus() == PaymentStatus.CAPTURED || command.getObservedStatus() == PaymentStatus.AUTHORIZED) {
            payment.markCaptured(command.getRazorpayPaymentId(), command.getRazorpaySignature());
            if (command.getWebhookEventId() != null) {
                payment.setWebhookEventId(command.getWebhookEventId());
            }
            paymentRepository.save(payment);

            PaymentCompletedEvent event = PaymentCompletedEvent.create(
                    payment.getOrderId(),
                    payment.getRazorpayPaymentId(),
                    payment.getRazorpayOrderId(),
                    payment.getAmount(),
                    payment.getPaymentMethod(),
                    "SUCCESS"
            );

            // Persist to outbox in same ACID transaction
            publishOutboxEvent("payment-completed", String.valueOf(payment.getOrderId()), event);
            log.info("Payment #{} successfully CAPTURED. Outbox event created for Order #{}", payment.getId(), payment.getOrderId());

            return toResponse(payment, "Payment verified and captured successfully");
        } else {
            payment.markFailed(command.getFailureReason() != null ? command.getFailureReason() : "Payment failed at gateway");
            paymentRepository.save(payment);

            publishOutboxEvent("payments.payment-failed", String.valueOf(payment.getOrderId()),
                    PaymentFailedEvent.of(payment.getOrderId(), command.getRazorpayPaymentId(), payment.getAmount(), payment.getFailureReason()));

            return toResponse(payment, "Payment marked as failed");
        }
    }

    /**
     * Preserved legacy REST endpoint adapter delegating to recordPaymentObservation.
     */
    @Transactional
    public PaymentResponse verifyPayment(PaymentVerificationRequest request) {
        PaymentObservationCommand command = PaymentObservationCommand.builder()
                .orderId(request.getOrderId())
                .razorpayOrderId(request.getRazorpayOrderId())
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .razorpaySignature(request.getRazorpaySignature())
                .source(ObservationSource.REST_CHECKOUT)
                .observedStatus(PaymentStatus.CAPTURED)
                .build();
        return recordPaymentObservation(command);
    }

    private void publishOutboxEvent(String eventType, String aggregateId, Object payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            PaymentOutboxJpaEntity outbox = new PaymentOutboxJpaEntity("Payment", aggregateId, eventType, json);
            outboxRepository.save(outbox);
        } catch (Exception e) {
            log.error("Failed to serialize outbox event {}: {}", eventType, e.getMessage(), e);
            throw new RuntimeException("Failed to save outbox event", e);
        }
    }

    private PaymentResponse toResponse(Payment p, String message) {
        return PaymentResponse.builder()
                .orderId(p.getRazorpayOrderId())
                .amount(p.getAmount().multiply(new BigDecimal("100")).toBigInteger().toString())
                .currency(p.getCurrency())
                .key(razorpayClientService.getKeyId())
                .status(p.getStatus() != null ? p.getStatus().name().toLowerCase() : "unknown")
                .message(message)
                .build();
    }
}
