package com.khandualoom.microservice.common.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class InternalAssertionTokenServiceTest {

    private final String primaryKey = "test-secret-key-for-zero-trust-testing-min-32-chars";
    private final String secondaryKey = "secondary-backup-key-for-zero-downtime-rotation";

    private final InternalAssertionTokenService tokenService = new InternalAssertionTokenService(
            primaryKey,
            secondaryKey,
            60000L
    );

    @Test
    @DisplayName("Should generate and successfully validate valid internal assertion token")
    void shouldGenerateAndValidateToken() {
        String token = tokenService.generateToken();
        assertThat(token).isNotBlank();
        assertThat(tokenService.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("Should generate and validate V2 token binding method and path")
    void shouldGenerateAndValidateV2Token() {
        String token = tokenService.generateV2Token("POST", "/api/orders", "api-gateway", "order-service");
        assertThat(token).startsWith("v2:POST:/api/orders:api-gateway:order-service:");

        // Validating with exact matching context
        boolean valid = tokenService.validateToken(token, "POST", "/api/orders", "order-service");
        assertThat(valid).isTrue();
    }

    @Test
    @DisplayName("Should reject V2 token when HTTP method or path is mismatched")
    void shouldRejectV2TokenOnMethodOrPathMismatch() {
        String token = tokenService.generateV2Token("POST", "/api/orders", "api-gateway", "order-service");

        // Attacker attempts GET instead of POST
        boolean methodMismatch = tokenService.validateToken(token, "GET", "/api/orders", "order-service");
        assertThat(methodMismatch).isFalse();

        // Attacker attempts to redirect to /api/admin
        boolean pathMismatch = tokenService.validateToken(token, "POST", "/api/admin", "order-service");
        assertThat(pathMismatch).isFalse();
    }

    @Test
    @DisplayName("Should detect and REJECT replay attack using identical nonce")
    void shouldRejectReplayAttack() {
        String token = tokenService.generateToken();

        // First verification succeeds
        assertThat(tokenService.validateToken(token)).isTrue();

        // Second verification with identical token/nonce MUST be rejected as replay attack
        assertThat(tokenService.validateToken(token)).isFalse();
    }

    @Test
    @DisplayName("Should support zero-downtime key rotation using secondary key")
    void shouldSupportKeyRotation() {
        // Create an old service instance with the secondary key as primary
        InternalAssertionTokenService oldService = new InternalAssertionTokenService(secondaryKey, 60000L);
        String tokenFromOldService = oldService.generateToken();

        // New service instance validating with primary + secondary key
        boolean validatedViaSecondary = tokenService.validateToken(tokenFromOldService);
        assertThat(validatedViaSecondary).isTrue();
    }

    @Test
    @DisplayName("Should reject tampered internal assertion token")
    void shouldRejectTamperedToken() {
        String token = tokenService.generateToken();
        String tampered = token.substring(0, token.length() - 2) + "aa";
        assertThat(tokenService.validateToken(tampered)).isFalse();
    }

    @Test
    @DisplayName("Should reject expired internal token with clock skew beyond 60s")
    void shouldRejectExpiredToken() {
        long expiredTime = System.currentTimeMillis() - 70000L;
        String nonce = "1234567890abcdef";
        String oldToken = expiredTime + ":" + nonce + ":somesig";
        assertThat(tokenService.validateToken(oldToken)).isFalse();
    }

    @Test
    @DisplayName("Should reject malformed internal token")
    void shouldRejectMalformedToken() {
        assertThat(tokenService.validateToken("not-a-token")).isFalse();
        assertThat(tokenService.validateToken("")).isFalse();
        assertThat(tokenService.validateToken(null)).isFalse();
    }
}
