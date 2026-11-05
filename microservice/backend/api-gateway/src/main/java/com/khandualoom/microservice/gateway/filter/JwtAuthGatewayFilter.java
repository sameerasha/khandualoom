package com.khandualoom.microservice.gateway.filter;

import com.khandualoom.microservice.common.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.Set;

/**
 * Enterprise API Gateway Perimeter Authorization Filter.
 * Enforces Role-Based Access Control (RBAC):
 *  - Super Admin APIs (/api/super-admin/**) -> SUPER_ADMIN only.
 *  - Admin APIs (/api/admin/**) -> ADMIN and SUPER_ADMIN only.
 *    (Rejects USER role with HTTP 403 Forbidden).
 *  - User APIs (/api/users/**, /api/orders/**, etc.) -> USER, ADMIN, and SUPER_ADMIN.
 *  - Public APIs -> Unauthenticated access permitted.
 * Relays authenticated user identity downstream via X-User-Email, X-User-Role, and X-User-Id headers.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthGatewayFilter implements GlobalFilter, Ordered {

    private final JwtUtils jwtUtils;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // Whitelisted public endpoints
    private static final List<String> PUBLIC_PATTERNS = List.of(
            "/actuator/**",
            "/images/**",
            "/favicon.ico",
            "/api/health",
            "/api/auth/**",
            "/api/ai/**"
    );

    // Public GET endpoints
    private static final List<String> PUBLIC_GET_PATTERNS = List.of(
            "/api/products/**",
            "/api/products",
            "/api/social-media/**",
            "/api/social-media"
    );

    // Public POST endpoints
    private static final List<String> PUBLIC_POST_PATTERNS = List.of(
            "/api/contact/**",
            "/api/contact",
            "/api/payment/webhook"
    );

    // Super Admin endpoints (ROLE_SUPER_ADMIN only)
    private static final List<String> SUPER_ADMIN_PATTERNS = List.of(
            "/api/super-admin/**"
    );

    // Admin endpoints (ROLE_ADMIN, ROLE_SUPER_ADMIN only)
    private static final List<String> ADMIN_PATTERNS = List.of(
            "/api/admin/**"
    );

    // User endpoints (ROLE_USER, ROLE_ADMIN, ROLE_SUPER_ADMIN)
    private static final List<String> USER_PATTERNS = List.of(
            "/api/users/**",
            "/api/orders/**",
            "/api/checkout/**",
            "/api/payment/**"
    );

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();

        // 1. Allow Preflight CORS OPTIONS requests
        if (HttpMethod.OPTIONS.equals(method)) {
            return chain.filter(exchange);
        }

        // 2. Check if route is public
        if (isPublicRoute(path, method)) {
            // Optional token extraction for public endpoints if token is provided
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtils.validateToken(token)) {
                    ServerHttpRequest mutatedRequest = propagateHeaders(request, token);
                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                }
            }
            return chain.filter(exchange);
        }

        // 3. Extract & Validate Bearer Token
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header on protected route: {}", path);
            return writeErrorResponse(exchange, HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header", path);
        }

        String token = authHeader.substring(7);
        if (!jwtUtils.validateToken(token)) {
            log.warn("Invalid or expired JWT token on route: {}", path);
            return writeErrorResponse(exchange, HttpStatus.UNAUTHORIZED, "Invalid or expired JWT token", path);
        }

        String email = jwtUtils.extractUsername(token);
        String role = jwtUtils.extractRole(token);
        Long userId = jwtUtils.extractUserId(token);

        log.debug("Authenticated request from user: {} with role: {} for path: {}", email, role, path);

        // 4. Enforce Role-Based Access Control (RBAC)

        // Super Admin Endpoints
        if (isSuperAdminRoute(path)) {
            if (!"ROLE_SUPER_ADMIN".equalsIgnoreCase(role)) {
                log.warn("Access Denied: User {} with role {} attempted to access super-admin path {}", email, role, path);
                return writeErrorResponse(exchange, HttpStatus.FORBIDDEN, "Access Denied: SUPER_ADMIN role required", path);
            }
        }

        // Admin Endpoints
        if (isAdminRoute(path)) {
            if (!"ROLE_ADMIN".equalsIgnoreCase(role) && !"ROLE_SUPER_ADMIN".equalsIgnoreCase(role)) {
                log.warn("Access Denied: User {} with role {} attempted to access admin path {}", email, role, path);
                return writeErrorResponse(exchange, HttpStatus.FORBIDDEN, "Access Denied: Only ADMIN or SUPER_ADMIN role can access admin APIs.", path);
            }
        }

        // User Endpoints: accessible by USER, ADMIN, and SUPER_ADMIN
        if (isUserRoute(path)) {
            Set<String> allowedRoles = Set.of("ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN");
            if (!allowedRoles.contains(role.toUpperCase())) {
                log.warn("Access Denied: User {} with role {} attempted to access user path {}", email, role, path);
                return writeErrorResponse(exchange, HttpStatus.FORBIDDEN, "Access Denied: Insufficient permissions for user APIs.", path);
            }
        }

        // 5. Mutate request headers with validated identity and forward downstream
        ServerHttpRequest mutatedRequest = propagateHeaders(request, token);
        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    private boolean isPublicRoute(String path, HttpMethod method) {
        // Exclude explicit admin paths from public matchers
        if (isAdminRoute(path) || isSuperAdminRoute(path)) {
            return false;
        }

        for (String pattern : PUBLIC_PATTERNS) {
            if (pathMatcher.match(pattern, path)) {
                return true;
            }
        }

        if (HttpMethod.GET.equals(method)) {
            for (String pattern : PUBLIC_GET_PATTERNS) {
                if (pathMatcher.match(pattern, path)) {
                    return true;
                }
            }
        }

        if (HttpMethod.POST.equals(method)) {
            for (String pattern : PUBLIC_POST_PATTERNS) {
                if (pathMatcher.match(pattern, path)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean isSuperAdminRoute(String path) {
        return SUPER_ADMIN_PATTERNS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
    }

    private boolean isAdminRoute(String path) {
        return ADMIN_PATTERNS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
    }

    private boolean isUserRoute(String path) {
        return USER_PATTERNS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
    }

    private ServerHttpRequest propagateHeaders(ServerHttpRequest request, String token) {
        String email = jwtUtils.extractUsername(token);
        String role = jwtUtils.extractRole(token);
        Long userId = jwtUtils.extractUserId(token);

        return request.mutate()
                .headers(headers -> {
                    if (email != null) {
                        headers.set("X-User-Email", email);
                    }
                    if (role != null) {
                        headers.set("X-User-Role", role);
                    }
                    if (userId != null) {
                        headers.set("X-User-Id", String.valueOf(userId));
                    }
                    headers.set("X-Gateway-Identity", "khandualoom-gateway-verified");
                })
                .build();
    }

    private Mono<Void> writeErrorResponse(ServerWebExchange exchange, HttpStatus status, String message, String path) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String jsonError = String.format(
                "{\"timestamp\":\"%s\",\"status\":%d,\"error\":\"%s\",\"message\":\"%s\",\"path\":\"%s\"}",
                Instant.now().toString(),
                status.value(),
                status.getReasonPhrase(),
                message,
                path
        );

        byte[] bytes = jsonError.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }
}
