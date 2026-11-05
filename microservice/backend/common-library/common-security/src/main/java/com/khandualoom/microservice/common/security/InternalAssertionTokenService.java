package com.khandualoom.microservice.common.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Formatter;
import java.util.UUID;

@Service
@Slf4j
public class InternalAssertionTokenService {

    public static final String GATEWAY_IDENTITY_HEADER = "X-Gateway-Identity";
    public static final String GATEWAY_ASSERTION_HEADER = "X-Gateway-Assertion";

    private final String clusterSecret;
    private final long maxSkewMs;

    public InternalAssertionTokenService(
            @Value("${khandualoom.security.internal-secret:khandualoom-internal-zero-trust-cluster-secret-key-32b-min!}") String clusterSecret,
            @Value("${khandualoom.security.internal-max-skew-ms:60000}") long maxSkewMs) {
        this.clusterSecret = clusterSecret;
        this.maxSkewMs = maxSkewMs;
    }

    /**
     * Generates a signed internal token formatted as: timestamp:nonce:signature
     */
    public String generateToken() {
        long timestamp = System.currentTimeMillis();
        String nonce = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String data = timestamp + ":" + nonce;
        String signature = computeHmac(data, clusterSecret);
        return timestamp + ":" + nonce + ":" + signature;
    }

    /**
     * Validates an internal token: checks format, freshness (within 60s), and HMAC constant-time equality.
     */
    public boolean validateToken(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        String[] parts = token.split(":");
        if (parts.length != 3) {
            log.warn("Invalid internal token structure: expected 3 parts, got {}", parts.length);
            return false;
        }

        try {
            long timestamp = Long.parseLong(parts[0]);
            String nonce = parts[1];
            String signature = parts[2];

            long now = System.currentTimeMillis();
            if (Math.abs(now - timestamp) > maxSkewMs) {
                log.warn("Internal token expired or clock skewed: tokenTimestamp={}, current={}, skewMs={}",
                        timestamp, now, Math.abs(now - timestamp));
                return false;
            }

            String data = timestamp + ":" + nonce;
            String expectedSignature = computeHmac(data, clusterSecret);

            return MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (NumberFormatException e) {
            log.warn("Malformed timestamp in internal token: {}", parts[0]);
            return false;
        } catch (Exception e) {
            log.error("Internal token validation failed: {}", e.getMessage());
            return false;
        }
    }

    private String computeHmac(String data, String secret) {
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
