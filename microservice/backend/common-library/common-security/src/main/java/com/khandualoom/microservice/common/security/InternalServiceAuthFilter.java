package com.khandualoom.microservice.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class InternalServiceAuthFilter extends OncePerRequestFilter {

    private final InternalAssertionTokenService tokenService;
    private final boolean enforceAll;

    public InternalServiceAuthFilter(InternalAssertionTokenService tokenService) {
        this(tokenService, false);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Allow actuator health and public webhooks without internal token
        if (path.startsWith("/actuator") || path.startsWith("/api/health") || path.contains("/webhook")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = request.getHeader(InternalAssertionTokenService.GATEWAY_IDENTITY_HEADER);
        if (token == null || token.isBlank()) {
            token = request.getHeader(InternalAssertionTokenService.GATEWAY_ASSERTION_HEADER);
        }

        if (enforceAll && (token == null || !tokenService.validateToken(token))) {
            log.warn("Blocked direct access to [{}] without valid cryptographic gateway assertion token", path);
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"status\":403,\"error\":\"Forbidden\",\"message\":\"Access denied: Missing or invalid internal gateway identity assertion\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
