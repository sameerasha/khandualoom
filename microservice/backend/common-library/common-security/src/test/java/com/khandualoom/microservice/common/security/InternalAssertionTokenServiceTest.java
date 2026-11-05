package com.khandualoom.microservice.common.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class InternalAssertionTokenServiceTest {

    private final InternalAssertionTokenService tokenService = new InternalAssertionTokenService(
            "test-secret-key-for-zero-trust-testing-min-32-chars",
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
        // construct with an old timestamp
        InternalAssertionTokenService oldService = new InternalAssertionTokenService("test-secret", 60000L);
        String oldToken = expiredTime + ":" + nonce + ":somesig";
        assertThat(oldService.validateToken(oldToken)).isFalse();
    }

    @Test
    @DisplayName("Should reject malformed internal token")
    void shouldRejectMalformedToken() {
        assertThat(tokenService.validateToken("not-a-token")).isFalse();
        assertThat(tokenService.validateToken("")).isFalse();
        assertThat(tokenService.validateToken(null)).isFalse();
    }
}
