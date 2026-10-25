package com.khandualoom.microservice.gateway.config;

import com.khandualoom.microservice.common.security.JwtUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewaySecurityConfig {

    @Bean
    public JwtUtils jwtUtils(
            @Value("${khandualoom.jwt.secret:${khandualoom.jwt.secret:${khandualoom.jwt.secret:9a4f2c8d3b7a1e6f5c8d0b2a4f6e8d1c3b5a7f9e2d4c6b8a0f1e3d5c7b9a2f4}}}") String secret,
            @Value("${khandualoom.jwt.expiration-ms:${khandualoom.jwt.expiration-ms:${khandualoom.jwt.expiration-ms:86400000}}}") long expirationMs,
            @Value("${khandualoom.jwt.refresh-expiration-ms:${khandualoom.jwt.refresh-expiration-ms:${khandualoom.jwt.refresh-expiration-ms:604800000}}}") long refreshExpirationMs) {
        return new JwtUtils(secret, expirationMs, refreshExpirationMs);
    }
}
