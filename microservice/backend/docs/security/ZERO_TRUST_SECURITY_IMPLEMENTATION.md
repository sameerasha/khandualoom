# Zero-Trust Security Implementation & Hardening Specification

## Principles

Khandua Looms enforces a strict **Zero-Trust Architecture**:
1. **Never Trust, Always Verify**: Internal network perimeter location does not imply trust.
2. **Least Privilege**: Microservices only accept traffic from authorized callers.
3. **Defense-in-Depth**: Security is enforced at Network, Transport, Identity, and Application layers simultaneously.

---

## 1. Perimeter Defense & Header Sanitization (`api-gateway`)

### 1.1 Ingress Threat Model: Header Spoofing
Untrusted public clients may attempt to inject internal headers (`X-User-Role: ROLE_ADMIN` or `X-Gateway-Identity: khandualoom-gateway-verified`) to bypass security checks on backend microservices.

### 1.2 Sanitization & Gateway Filter Enforcement
In `JwtAuthGatewayFilter.java`:
```java
// Strip any client-supplied internal spoofing headers before downstream routing
ServerHttpRequest sanitizedRequest = request.mutate()
        .headers(h -> {
            h.remove(InternalAssertionTokenService.GATEWAY_IDENTITY_HEADER);
            h.remove(InternalAssertionTokenService.GATEWAY_ASSERTION_HEADER);
            h.remove("X-Internal-Secret");
        })
        .build();
```

---

## 2. Cryptographic Inter-Service Assertion Protocol

Instead of static header tokens, the platform utilizes time-bounded, cryptographic HMAC-SHA256 assertions generated dynamically by `InternalAssertionTokenService`.

### Token Format
`timestamp:nonce:signature`
- `timestamp`: Epoch milliseconds at assertion generation.
- `nonce`: 16-character cryptographic pseudo-random hex string.
- `signature`: `HmacSHA256(timestamp + ":" + nonce, clusterSecret)`

### Validation Rules
1. **Structural Integrity**: Must contain exactly 3 colon-delimited components.
2. **Freshness Window**: `|System.currentTimeMillis() - timestamp| <= 60,000ms`. Rejects stale or replayed assertions beyond 60 seconds.
3. **Constant-Time Verification**: `MessageDigest.isEqual(...)` prevents timing side-channel attacks.

### Application Verification (`OrderController.java`)
Direct requests to sensitive endpoints (e.g. admin order views) that lack a valid cryptographic assertion token are immediately rejected with **HTTP 403 Forbidden**:
```java
if (isAdmin && (gatewayToken == null || !internalAssertionTokenService.validateToken(gatewayToken)) && principal == null) {
    log.warn("Blocked unverified direct admin access attempt without valid cryptographic gateway assertion");
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of("status", 403, "error", "Forbidden", "message", "Direct internal microservice admin access denied."));
}
```

---

## 3. Network Isolation & Kubernetes NetworkPolicies

1. **Docker Compose**: Internal microservice ports (`8081-8089`) are bound exclusively to `127.0.0.1`, preventing exposure to external hosts or LAN interfaces.
2. **Kubernetes CNI Policy (`infrastructure/kubernetes/network-policy.yaml`)**:
   - Backend microservices (`order-service`, `payment-service`, `inventory-service`) reject all external ingress.
   - Ingress is permitted **only** from pods bearing label `app: api-gateway`.
   - Database and Kafka ports are locked to backend pods only.

---

## 4. OWASP API Top 10 Mitigations

| Vulnerability | Mitigation in Khandua Looms |
| :--- | :--- |
| **API1: Broken Object Level Authorization (BOLA/IDOR)** | Non-admin users are strictly scoped in SQL queries by authenticated `X-User-Id` extracted from validated JWT claims (`findByUserId(userId)`). Users cannot access arbitrary order IDs. |
| **API2: Broken Authentication** | Stateless JWT validation with RS256/HS256, 15-minute token expiry, 7-day refresh with single-use token rotation. |
| **API3: Broken Object Property Level Auth** | Strict DTO segregation: domain entities are never exposed or bound directly in presentation controllers. |
| **API4: Unrestricted Resource Consumption** | `SkuAdmissionControl` rate limits per-SKU concurrency to 50 permits; gateway global rate limiting at 10,000 req/s. |
| **API5: Broken Function Level Authorization** | Method/endpoint RBAC matrix enforcing `ROLE_SUPER_ADMIN`, `ROLE_ADMIN`, and `ROLE_USER` hierarchy at gateway and controller levels. |
