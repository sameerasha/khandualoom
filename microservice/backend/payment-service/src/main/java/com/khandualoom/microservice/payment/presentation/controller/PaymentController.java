package com.khandualoom.microservice.payment.presentation.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.payment.application.dto.ObservationSource;
import com.khandualoom.microservice.payment.application.dto.PaymentObservationCommand;
import com.khandualoom.microservice.payment.application.dto.PaymentRequest;
import com.khandualoom.microservice.payment.application.dto.PaymentResponse;
import com.khandualoom.microservice.payment.application.dto.PaymentVerificationRequest;
import com.khandualoom.microservice.payment.application.service.PaymentApplicationService;
import com.khandualoom.microservice.payment.domain.model.PaymentStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/payment")
@Slf4j
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentApplicationService paymentService;
    private final ObjectMapper objectMapper;

    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponse> createOrder(@RequestBody PaymentRequest request) {
        log.info("Received payment order creation request for amount: {}", request.getAmount());
        PaymentResponse response = paymentService.createPaymentOrder(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        log.info("Received payment verification request for Razorpay order: {}", request.getRazorpayOrderId());
        PaymentResponse response = paymentService.verifyPayment(request);

        if ("failed".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Unified Razorpay asynchronous webhook ingestion endpoint.
     * Supports payment.captured, payment.failed, refund.processed, and refund.failed.
     */
    @PostMapping("/webhook")
    public ResponseEntity<PaymentResponse> handleWebhook(
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestHeader(value = "X-Razorpay-Event-Id", required = false) String eventId,
            @RequestBody String rawPayload) {
        log.info("Received Razorpay webhook callback: eventId={}", eventId);

        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            String eventType = root.path("event").asText("");

            // Route refund webhooks
            if (eventType.startsWith("refund.")) {
                JsonNode refundEntity = root.path("payload").path("refund").path("entity");
                String refundId = refundEntity.path("id").asText(null);
                String paymentId = refundEntity.path("payment_id").asText(null);
                String refundStatus = refundEntity.path("status").asText("processed");

                PaymentResponse response = paymentService.processRefundWebhook(
                        refundId, paymentId, refundStatus, eventId, rawPayload, signature);
                return ResponseEntity.ok(response);
            }

            // Route payment webhooks
            JsonNode paymentEntity = root.path("payload").path("payment").path("entity");
            String razorpayOrderId = paymentEntity.path("order_id").asText(null);
            String razorpayPaymentId = paymentEntity.path("id").asText(null);
            long amountInPaise = paymentEntity.path("amount").asLong(0);
            String currency = paymentEntity.path("currency").asText("INR");
            BigDecimal amount = BigDecimal.valueOf(amountInPaise).divide(BigDecimal.valueOf(100));

            PaymentStatus observedStatus = "payment.captured".equalsIgnoreCase(eventType)
                    ? PaymentStatus.CAPTURED
                    : PaymentStatus.FAILED;

            PaymentObservationCommand command = PaymentObservationCommand.builder()
                    .razorpayOrderId(razorpayOrderId)
                    .razorpayPaymentId(razorpayPaymentId)
                    .razorpaySignature(signature)
                    .webhookEventId(eventId)
                    .source(ObservationSource.WEBHOOK)
                    .observedStatus(observedStatus)
                    .rawPayload(rawPayload)
                    .amount(amount)
                    .currency(currency)
                    .failureReason("payment.failed".equalsIgnoreCase(eventType) ? "Failed via webhook event" : null)
                    .build();

            PaymentResponse response = paymentService.recordPaymentObservation(command);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to parse or process webhook payload: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(PaymentResponse.builder().status("error").message(e.getMessage()).build());
        }
    }
}
