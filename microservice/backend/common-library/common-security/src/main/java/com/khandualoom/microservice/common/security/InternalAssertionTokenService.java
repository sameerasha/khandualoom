package com.khandualoom.microservice.common.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Formatter;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class InternalAssertionTokenService {

    public static final String GATEWAY_IDENTITY_HEADER = "X-Gateway-Identity";
    public static final String GATEWAY_ASSERTION_HEADER = "X-Gateway-Assertion";

    private final String primarySecret;
    private final String secondarySecret;
    private final long maxSkewMs;
    private final StringRedisTemplate redisTemplate;

    // Atomic Nonce Replay Cache (nonce -> timestamp)
    private final ConcurrentHashMap<String, Long> usedNonces = new ConcurrentHashMap<>();
    private long lastNonceCleanup = System.currentTimeMillis();

    public InternalAssertionTokenService(
            @Value("${khandualoom.security.internal-secret:khandualoom-internal-zero-trust-cluster-secret-key-32b-min!}") String primarySecret,
            @Value("${khandualoom.security.internal-secondary-secret:}") String secondarySecret,
            @Value("${khandualoom.security.internal-max-skew-ms:60000}") long maxSkewMs,
            @Autowired(required = false) StringRedisTemplate redisTemplate) {
        this.primarySecret = primarySecret;
        this.secondarySecret = secondarySecret != null && !secondarySecret.isBlank() ? secondarySecret : null;
        this.maxSkewMs = maxSkewMs;
        this.redisTemplate = redisTemplate;
    }

    public InternalAssertionTokenService(
            String primarySecret,
            String secondarySecret,
            long maxSkewMs) {
        this(primarySecret, secondarySecret, maxSkewMs, null);
    }

    public InternalAssertionTokenService(String primarySecret, long maxSkewMs) {
        this(primarySecret, null, maxSkewMs, null);
    }

    /**
     * V1 Backward compatible generation: timestamp:nonce:signature
     */
    public String generateToken() {
        long timestamp = System.currentTimeMillis();
        String nonce = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String data = timestamp + ":" + nonce;
        String signature = computeHmac(data, primarySecret);
        return timestamp + ":" + nonce + ":" + signature;
    }

    /**
     * V2 Hardened Generation: signs HTTP method, canonical path, caller, recipient, timestamp, and nonce.
     * Format: v2:method:path:caller:recipient:timestamp:nonce:signature
     */
    public String generateV2Token(String method, String canonicalPath, String caller, String recipient) {
        long timestamp = System.currentTimeMillis();
        String nonce = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String cleanMethod = method != null ? method.toUpperCase() : "GET";
        String cleanPath = canonicalPath != null ? canonicalPath : "/";
        String cleanCaller = caller != null ? caller : "api-gateway";
        String cleanRecipient = recipient != null ? recipient : "*";

        String data = "v2:" + cleanMethod + ":" + cleanPath + ":" + cleanCaller + ":" + cleanRecipient + ":" + timestamp + ":" + nonce;
        String signature = computeHmac(data, primarySecret);
        return "v2:" + cleanMethod + ":" + cleanPath + ":" + cleanCaller + ":" + cleanRecipient + ":" + timestamp + ":" + nonce + ":" + signature;
    }

    /**
     * Validates an internal token (supports both V1 and V2) with atomic single-use nonce verification.
     */
    public boolean validateToken(String token) {
        return validateToken(token, null, null, null);
    }

    /**
     * Validates an internal token with contextual method, path, and recipient binding.
     */
    public boolean validateToken(String token, String expectedMethod, String expectedPath, String expectedRecipient) {
        if (token == null || token.isBlank()) {
            return false;
        }

        cleanupExpiredNoncesIfNecessary();

        String[] parts = token.split(":");
        if (parts.length == 3) {
            // V1 Token validation: timestamp:nonce:signature
            return validateV1Token(parts[0], parts[1], parts[2]);
        } else if (parts.length == 8 && "v2".equals(parts[0])) {
            // V2 Token validation: v2:method:path:caller:recipient:timestamp:nonce:signature
            String methodInToken = parts[1];
            String pathInToken = parts[2];
            String caller = parts[3];
            String recipient = parts[4];
            String timestampStr = parts[5];
            String nonce = parts[6];
            String signature = parts[7];
            return validateV2Token(methodInToken, pathInToken, caller, recipient, timestampStr, nonce, signature,
                    expectedMethod, expectedPath, expectedRecipient);
        } else {
            log.warn("Invalid internal token structure: unrecognized part count [{}]", parts.length);
            return false;
        }
    }

    private boolean validateV1Token(String timestampStr, String nonce, String signature) {
        try {
            long timestamp = Long.parseLong(timestampStr);
            long now = System.currentTimeMillis();

            if (Math.abs(now - timestamp) > maxSkewMs) {
                log.warn("Internal token expired or clock skewed: tokenTimestamp={}, current={}, skewMs={}",
                        timestamp, now, Math.abs(now - timestamp));
                return false;
            }

            // Atomic Nonce Replay Check
            if (!recordNonceIfAbsent(nonce, now)) {
                return false;
            }

            String data = timestamp + ":" + nonce;
            return verifyHmac(data, signature);
        } catch (NumberFormatException e) {
            log.warn("Malformed timestamp in internal token: {}", timestampStr);
            return false;
        } catch (Exception e) {
            log.error("Internal token validation failed: {}", e.getMessage());
            return false;
        }
    }

    private boolean validateV2Token(String methodInToken, String pathInToken, String caller, String recipient,
                                    String timestampStr, String nonce, String signature,
                                    String expectedMethod, String expectedPath, String expectedRecipient) {
        try {
            long timestamp = Long.parseLong(timestampStr);
            long now = System.currentTimeMillis();

            if (Math.abs(now - timestamp) > maxSkewMs) {
                log.warn("V2 Internal token expired or clock skewed: tokenTimestamp={}, current={}, skewMs={}",
                        timestamp, now, Math.abs(now - timestamp));
                return false;
            }

            // Verify expected method if provided
            if (expectedMethod != null && !expectedMethod.equalsIgnoreCase(methodInToken) && !"*".equals(methodInToken)) {
                log.warn("V2 Token method mismatch: expected [{}], found [{}]", expectedMethod, methodInToken);
                return false;
            }

            // Verify expected path if provided
            if (expectedPath != null && !expectedPath.equalsIgnoreCase(pathInToken) && !"*".equals(pathInToken)) {
                log.warn("V2 Token path mismatch: expected [{}], found [{}]", expectedPath, pathInToken);
                return false;
            }

            // Verify expected recipient if provided
            if (expectedRecipient != null && !expectedRecipient.equals(recipient) && !"*".equals(recipient)) {
                log.warn("V2 Token recipient mismatch: expected [{}], found [{}]", expectedRecipient, recipient);
                return false;
            }

            // Atomic Nonce Replay Check
            if (!recordNonceIfAbsent(nonce, now)) {
                return false;
            }

            String data = "v2:" + methodInToken + ":" + pathInToken + ":" + caller + ":" + recipient + ":" + timestamp + ":" + nonce;
            return verifyHmac(data, signature);
        } catch (NumberFormatException e) {
            log.warn("Malformed timestamp in V2 token: {}", timestampStr);
            return false;
        } catch (Exception e) {
            log.error("V2 Internal token validation failed: {}", e.getMessage());
            return false;
        }
    }

    private boolean recordNonceIfAbsent(String nonce, long now) {
        if (redisTemplate != null) {
            try {
                Boolean wasSet = redisTemplate.opsForValue()
                        .setIfAbsent("khandualoom:nonce:" + nonce, String.valueOf(now), Duration.ofMillis(maxSkewMs));
                if (Boolean.FALSE.equals(wasSet)) {
                    log.warn("Cluster Security Alert: Replay attack detected via distributed Redis! Nonce [{}] already consumed", nonce);
                    return false;
                }
            } catch (Exception e) {
                log.warn("Distributed Redis nonce check unavailable: {}. Falling back to container memory nonce cache", e.getMessage());
            }
        }

        Long existing = usedNonces.putIfAbsent(nonce, now);
        if (existing != null) {
            log.warn("Security Alert: Replay attack detected! Nonce [{}] has already been consumed within active freshness window", nonce);
            return false;
        }
        return true;
    }

    private boolean verifyHmac(String data, String signature) {
        // Try Primary Key
        String expectedPrimary = computeHmac(data, primarySecret);
        if (MessageDigest.isEqual(expectedPrimary.getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8))) {
            return true;
        }

        // Try Secondary Key for seamless rotation
        if (secondarySecret != null) {
            String expectedSecondary = computeHmac(data, secondarySecret);
            return MessageDigest.isEqual(expectedSecondary.getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8));
        }

        return false;
    }

    private void cleanupExpiredNoncesIfNecessary() {
        long now = System.currentTimeMillis();
        if (now - lastNonceCleanup > maxSkewMs) {
            usedNonces.entrySet().removeIf(entry -> now - entry.getValue() > maxSkewMs);
            lastNonceCleanup = now;
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

    public static String sha256Hex(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
        }
    }
}
