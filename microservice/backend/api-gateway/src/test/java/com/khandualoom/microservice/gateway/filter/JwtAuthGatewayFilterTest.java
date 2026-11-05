package com.khandualoom.microservice.gateway.filter;

import com.khandualoom.microservice.common.security.InternalAssertionTokenService;
import com.khandualoom.microservice.common.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class JwtAuthGatewayFilterTest {

    private JwtUtils jwtUtils;
    private InternalAssertionTokenService tokenService;
    private JwtAuthGatewayFilter filter;

    @Mock
    private GatewayFilterChain chain;

    private final String secret = "testSecretKeyWithMinimumLengthOf256BitsForHMACSHA256!";
    private final long expirationMs = 3600000;
    private final long refreshExpirationMs = 7200000;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils(secret, expirationMs, refreshExpirationMs);
        tokenService = new InternalAssertionTokenService("cluster-secret-test-32b-min-length!", 60000L);
        filter = new JwtAuthGatewayFilter(jwtUtils, tokenService);
        when(chain.filter(any())).thenReturn(Mono.empty());
    }

    @Test
    @DisplayName("ROLE_USER accessing Admin API must be REJECTED with 403 Forbidden")
    void testUserRoleCannotAccessAdminApi() {
        String userToken = jwtUtils.generateToken("user@khandualoom.com", Map.of("role", "ROLE_USER", "userId", 101L));

        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/admin/products")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken)
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, chain).block();

        assertEquals(HttpStatus.FORBIDDEN, exchange.getResponse().getStatusCode());
        verify(chain, never()).filter(any());
    }

    @Test
    @DisplayName("ROLE_ADMIN accessing Admin API must be ALLOWED")
    void testAdminRoleCanAccessAdminApi() {
        String adminToken = jwtUtils.generateToken("admin@khandualoom.com", Map.of("role", "ROLE_ADMIN", "userId", 1L));

        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/admin/products")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, chain).block();

        verify(chain, times(1)).filter(any());
    }

    @Test
    @DisplayName("ROLE_ADMIN accessing User API must be ALLOWED")
    void testAdminRoleCanAccessUserApi() {
        String adminToken = jwtUtils.generateToken("admin@khandualoom.com", Map.of("role", "ROLE_ADMIN", "userId", 1L));

        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/users/profile")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, chain).block();

        verify(chain, times(1)).filter(any());
    }

    @Test
    @DisplayName("ROLE_USER accessing User API must be ALLOWED")
    void testUserRoleCanAccessUserApi() {
        String userToken = jwtUtils.generateToken("user@khandualoom.com", Map.of("role", "ROLE_USER", "userId", 101L));

        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/users/profile")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + userToken)
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, chain).block();

        verify(chain, times(1)).filter(any());
    }

    @Test
    @DisplayName("Unauthenticated request to Admin API must be REJECTED with 401 Unauthorized")
    void testUnauthenticatedCannotAccessAdminApi() {
        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/admin/orders")
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, chain).block();

        assertEquals(HttpStatus.UNAUTHORIZED, exchange.getResponse().getStatusCode());
        verify(chain, never()).filter(any());
    }

    @Test
    @DisplayName("Public Catalog GET /api/products must be ALLOWED without token")
    void testPublicApiAllowedWithoutToken() {
        MockServerHttpRequest request = MockServerHttpRequest
                .method(HttpMethod.GET, "/api/products")
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, chain).block();

        verify(chain, times(1)).filter(any());
    }

    @Test
    @DisplayName("Public Auth POST /api/auth/login must be ALLOWED without token")
    void testPublicAuthApiAllowedWithoutToken() {
        MockServerHttpRequest request = MockServerHttpRequest
                .method(HttpMethod.POST, "/api/auth/login")
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, chain).block();

        verify(chain, times(1)).filter(any());
    }
}
