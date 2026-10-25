package com.khandualoom.microservice.common.security;

public final class SecurityConstants {

    private SecurityConstants() {}

    public static final String AUTH_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";

    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";

    public static final String CLAIM_ROLES = "roles";
    public static final String CLAIM_ROLE = "role";
    public static final String CLAIM_USER_ID = "userId";
    public static final String CLAIM_EMAIL = "email";
}
