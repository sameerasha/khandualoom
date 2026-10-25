package com.khandualoom.microservice.order.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.khandualoom.microservice.order.dto.PaymentRequest;
import com.khandualoom.microservice.order.dto.PaymentResponse;
import com.khandualoom.microservice.order.dto.PaymentVerificationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.util.Formatter;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final OrderMetricsService orderMetricsService;

    @Value("${razorpay.key.id:rzp_test_dummy}")
    private String keyId;

    @Value("${razorpay.key.secret:dummy_secret}")
    private String keySecret;

    /**
     * Returns true if the service is operating in dummy/simulation mode
     * (no real Razorpay keys configured).
     */
    public boolean isDummyMode() {
        return "rzp_test_dummy".equals(keyId) || "dummy_secret".equals(keySecret);
    }

    /**
     * Create a Razorpay order. In dummy mode, returns a mock order so
     * the frontend can proceed with the simulated flow.
     */
    public PaymentResponse createOrder(PaymentRequest request) {
        String receipt = "rcpt_" + UUID.randomUUID().toString().substring(0, 8);
        BigDecimal amountInPaise = request.getAmount().multiply(new BigDecimal("100"));

        if (isDummyMode()) {
            log.info("Razorpay dummy mode â€” returning mock order for amount â‚¹{}", request.getAmount());
            return PaymentResponse.builder()
                    .orderId("order_dummy_" + UUID.randomUUID().toString().substring(0, 8))
                    .amount(amountInPaise.toBigInteger().toString())
                    .currency("INR")
                    .key(keyId)
                    .status("created")
                    .receipt(receipt)
                    .build();
        }

        try {
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise.toBigInteger());
            orderRequest.put("currency", request.getCurrency());
            orderRequest.put("receipt", receipt);
            orderRequest.put("payment_capture", 1); // auto-capture

            Order order = razorpay.orders.create(orderRequest);
            log.info("Razorpay order created: {}", String.valueOf(order.get("id")));

            return PaymentResponse.builder()
                    .orderId(order.get("id"))
                    .amount(String.valueOf(order.get("amount")))
                    .currency(order.get("currency"))
                    .key(keyId)
                    .status("created")
                    .receipt(receipt)
                    .build();

        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order", e);
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    /**
     * Verify the payment signature returned by Razorpay checkout.
     * 
     * Razorpay signs: razorpay_order_id + "|" + razorpay_payment_id
     * using HMAC-SHA256 with the key secret. We regenerate the signature
     * and compare it to the one sent by the frontend.
     *
     * In dummy mode, accepts any signature (for development).
     */
    public PaymentResponse verifyPayment(PaymentVerificationRequest request) {
        if (isDummyMode()) {
            log.info("Razorpay dummy mode â€” auto-verifying payment {}", request.getRazorpayPaymentId());
            return PaymentResponse.builder()
                    .orderId(request.getRazorpayOrderId())
                    .status("verified")
                    .build();
        }

        try {
            String data = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
            String generatedSignature = hmacSha256(data, keySecret);

            if (generatedSignature.equals(request.getRazorpaySignature())) {
                log.info("Payment signature verified for order {}", request.getRazorpayOrderId());
                orderMetricsService.recordPaymentCompleted();
                return PaymentResponse.builder()
                        .orderId(request.getRazorpayOrderId())
                        .status("verified")
                        .build();
            } else {
                log.warn("Payment signature mismatch for order {}. Expected: {}, Got: {}",
                        request.getRazorpayOrderId(), generatedSignature, request.getRazorpaySignature());
                orderMetricsService.recordPaymentFailed();
                return PaymentResponse.builder()
                        .orderId(request.getRazorpayOrderId())
                        .status("failed")
                        .build();
            }

        } catch (Exception e) {
            log.error("Error during payment verification", e);
            orderMetricsService.recordPaymentFailed();
            return PaymentResponse.builder()
                    .orderId(request.getRazorpayOrderId())
                    .status("failed")
                    .build();
        }
    }

    /**
     * Compute HMAC-SHA256 of the given data using the provided key.
     */
    private String hmacSha256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] rawHmac = mac.doFinal(data.getBytes("UTF-8"));

        // Convert to hex string
        Formatter formatter = new Formatter();
        for (byte b : rawHmac) {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }
}

