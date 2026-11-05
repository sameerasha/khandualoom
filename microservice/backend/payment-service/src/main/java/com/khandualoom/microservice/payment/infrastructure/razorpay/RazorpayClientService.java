package com.khandualoom.microservice.payment.infrastructure.razorpay;

import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Refund;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Formatter;
import java.util.UUID;

@Service
@Slf4j
public class RazorpayClientService {

    @Value("${razorpay.key.id:rzp_test_dummy}")
    private String keyId;

    @Value("${razorpay.key.secret:dummy_secret}")
    private String keySecret;

    @Value("${razorpay.webhook.secret:dummy_webhook_secret}")
    private String webhookSecret;

    public boolean isDummyMode() {
        return "rzp_test_dummy".equals(keyId) || "dummy_secret".equals(keySecret);
    }

    public String getKeyId() {
        return keyId;
    }

    public String createRazorpayOrder(BigDecimal amountInPaise, String currency, String receipt) throws RazorpayException {
        if (isDummyMode()) {
            return "order_dummy_" + UUID.randomUUID().toString().substring(0, 8);
        }

        RazorpayClient client = new RazorpayClient(keyId, keySecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise.toBigInteger());
        orderRequest.put("currency", currency != null ? currency : "INR");
        orderRequest.put("receipt", receipt);
        orderRequest.put("payment_capture", 1);

        Order order = client.orders.create(orderRequest);
        return String.valueOf(order.get("id"));
    }

    /**
     * Verifies checkout payment signature with constant-time equality check to prevent timing attacks.
     */
    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String signature) {
        if (isDummyMode()) {
            return true;
        }
        if (razorpayOrderId == null || razorpayPaymentId == null || signature == null) {
            return false;
        }
        try {
            String data = razorpayOrderId + "|" + razorpayPaymentId;
            String generated = hmacSha256(data, keySecret);
            return MessageDigest.isEqual(
                    generated.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            log.error("Signature verification failure: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Verifies Razorpay webhook signature with constant-time equality using raw payload.
     */
    public boolean verifyWebhookSignature(String rawBody, String signature, String secretToUse) {
        if (isDummyMode()) {
            return true;
        }
        if (rawBody == null || signature == null) {
            return false;
        }
        String secret = (secretToUse != null && !secretToUse.isBlank()) ? secretToUse : this.webhookSecret;
        try {
            String generated = hmacSha256(rawBody, secret);
            return MessageDigest.isEqual(
                    generated.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            log.error("Webhook signature verification failure: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Issues automated refund for the given payment ID.
     */
    public String refundPayment(String paymentId, BigDecimal amountInPaise) throws RazorpayException {
        if (isDummyMode()) {
            log.info("Dummy Mode: Simulated refund for payment {}", paymentId);
            return "rfnd_dummy_" + UUID.randomUUID().toString().substring(0, 8);
        }

        RazorpayClient client = new RazorpayClient(keyId, keySecret);
        JSONObject refundRequest = new JSONObject();
        refundRequest.put("amount", amountInPaise.toBigInteger());
        refundRequest.put("reverse_all", 1);

        Refund refund = client.payments.refund(paymentId, refundRequest);
        return String.valueOf(refund.get("id"));
    }

    private String hmacSha256(String data, String secret) {
        try {
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(secretKey);
            byte[] hmacData = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return toHexString(hmacData);
        } catch (Exception e) {
            throw new RuntimeException("HMAC-SHA256 computation failed", e);
        }
    }

    private String toHexString(byte[] bytes) {
        try (Formatter formatter = new Formatter()) {
            for (byte b : bytes) {
                formatter.format("%02x", b);
            }
            return formatter.toString();
        }
    }
}
