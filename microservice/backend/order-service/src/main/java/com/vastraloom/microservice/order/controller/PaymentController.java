package com.vastraloom.microservice.order.controller;

import com.vastraloom.microservice.order.dto.PaymentRequest;
import com.vastraloom.microservice.order.dto.PaymentResponse;
import com.vastraloom.microservice.order.dto.PaymentVerificationRequest;
import com.vastraloom.microservice.order.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Create a Razorpay order for the given amount.
     * Returns order details + key for the frontend to open the Razorpay checkout modal.
     */
    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponse> createOrder(@RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createOrder(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Verify a Razorpay payment signature server-side.
     * The frontend calls this after receiving the Razorpay checkout callback,
     * BEFORE creating the order. This ensures the payment is authentic.
     */
    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        PaymentResponse response = paymentService.verifyPayment(request);

        if ("failed".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }
}

