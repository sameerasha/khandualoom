# Khandua Looms – Production Architecture Design

## Executive Summary

Khandua Looms is an enterprise, high-throughput e-commerce platform dedicated to handwoven sarees and textile heritage. This architecture specification outlines the production blueprint capable of processing **100,000+ daily orders**, sustaining **10,000 requests/second** during controlled flash-sale peaks, guaranteeing **strict zero-overselling** for rare handloom pieces, ensuring **dual-write proof payment processing**, and delivering a **99.99% availability SLA**.

---

## 1. System Topology & Service Boundaries

The platform operates on a 20-module Maven aggregator with 9 autonomous domain microservices, completely segregated by dedicated logical PostgreSQL schemas with zero cross-database SQL joins.

```mermaid
graph TD
    Client[Web & Mobile Clients] --> Gateway[API Gateway :8080]
    
    subgraph Edge & Security Boundary
        Gateway -->|HMAC-SHA256 Token| AuthSvc[Auth Service :8081]
        Gateway -->|HMAC-SHA256 Token| UserSvc[User Service :8082]
        Gateway -->|HMAC-SHA256 Token| ProductSvc[Product Service :8083]
        Gateway -->|HMAC-SHA256 Token| InvSvc[Inventory Service :8084]
        Gateway -->|HMAC-SHA256 Token| OrderSvc[Order Service :8085]
        Gateway -->|HMAC-SHA256 Token| PaymentSvc[Payment Service :8086]
    end

    subgraph Kafka KRaft Event Spine
        OrderSvc -->|orders.order-created| Kafka[(Kafka Cluster)]
        InvSvc -->|inventory.reserved / failed| Kafka
        PaymentSvc -->|payment-completed / failed| Kafka
        Kafka -->|notifications.*| NotifSvc[Notification Service :8087]
        Kafka -->|audit.*| AuditSvc[Audit Service :8088]
    end

    subgraph Persistence Isolation
        AuthSvc --- AuthDB[(auth_schema)]
        UserSvc --- UserDB[(user_schema)]
        ProductSvc --- ProdDB[(product_schema)]
        InvSvc --- InvDB[(inventory_schema)]
        OrderSvc --- OrderDB[(order_schema)]
        PaymentSvc --- PayDB[(payment_schema)]
    end
```

---

## 2. Distributed Transaction Architecture (Orchestrated Saga)

Distributed orders are coordinated through an **Orchestrated Saga Pattern** owned by the `order-service` with a persistent state machine and autonomous watchdog.

### Saga State Machine

```mermaid
stateDiagram-v2
    [*] --> STARTED: Order Placed (Outbox: order-created)
    STARTED --> INVENTORY_RESERVED: inventory.reserved
    STARTED --> CANCELLED: inventory.reservation-failed
    
    INVENTORY_RESERVED --> PAYMENT_PROCESSING: Payment Session Initiated
    PAYMENT_PROCESSING --> COMPLETED: payment-completed (Order CONFIRMED)
    PAYMENT_PROCESSING --> CANCELLED: payment-failed (Release Inventory)
    PAYMENT_PROCESSING --> CANCELLED: Watchdog Timeout (15m expired)
    
    CANCELLED --> [*]
    COMPLETED --> [*]
```

### Race-Condition Arbitration & Late Payment Reconciliation
If a customer completes payment at the 16th minute while the background watchdog expired the Saga at the 15th minute:
1. `OrderSagaOrchestrator` detects that `order.status == CANCELLED`.
2. It prevents overwriting the order status and routes the event to `orders.late-payment-reconciliation`.
3. `PaymentReconciliationService` verifies stock availability:
   - If stock can be re-reserved, it restores the order cleanly.
   - If stock was claimed by another customer, it executes an automated Razorpay refund, logs the `REFUND_INITIATE` operation in `payment_operation_ledger`, and emits `payments.refund-processed`.

---

## 3. High-Concurrency Flash Sale Architecture (Zero Overselling)

Rare handloom sarees exist in finite quantities (frequently only 1 saree per SKU). To prevent row lock contention and HikariCP connection pool exhaustion under 10,000 req/s:

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Gateway as API Gateway
    participant InvSvc as Inventory Service
    participant SkuControl as SkuAdmissionControl
    participant DB as PostgreSQL 16 (inventory_schema)

    Customer->>Gateway: POST /api/inventory/reserve (productId=101)
    Gateway->>InvSvc: Forward with X-Gateway-Identity
    InvSvc->>SkuControl: tryAcquire(productId=101, timeout=200ms)
    alt High Contention (> 50 in-flight requests on SKU)
        SkuControl-->>InvSvc: false (Permit Exhausted)
        InvSvc-->>Gateway: HTTP 429 Too Many Requests (Retry-After: 2s)
        Gateway-->>Customer: 429 Flash Sale Contention - Retry in 2s
    else Permit Acquired
        SkuControl-->>InvSvc: true
        InvSvc->>DB: UPDATE inventory SET reserved = reserved + 1 WHERE id=101 AND available >= 1
        DB-->>InvSvc: 1 row updated (Atomic Success)
        InvSvc->>DB: INSERT INTO stock_reservations ...
        InvSvc->>DB: INSERT INTO outbox_events ...
        InvSvc->>SkuControl: release(productId=101)
        InvSvc-->>Gateway: 200 Reservation Confirmed
        Gateway-->>Customer: 200 OK (Proceed to Payment)
    end
```

### Atomic Reservation Guarantees
- Single atomic SQL decrement: `UPDATE inventory_items SET available_stock = available_stock - :qty, reserved_stock = reserved_stock + :qty WHERE product_id = :id AND available_stock >= :qty`.
- State transitions on `stock_reservations` (`RESERVED -> CONSUMED` or `RESERVED -> RELEASED` or `RESERVED -> EXPIRED`) use atomic CAS updates (`UPDATE stock_reservations SET status = :target WHERE id = :id AND status = :expected`). If updated count == 0, no stock adjustments occur, strictly preventing double-fulfillment or double-release.

---

## 4. Payment Operation Ledger & Webhook Deduplication

```mermaid
flowchart TD
    A[Incoming Payment Operation] --> B{Idempotency Key / Webhook Event ID}
    B -->|Found in Ledger / Payment| C[Return Idempotent Cached Response]
    B -->|New Operation| D[Insert INITIATED record in payment_operation_ledger]
    D --> E[Execute Gateway Call / Signature Verification]
    E -->|Success| F[Transition Payment to CAPTURED / REFUNDED]
    F --> G[Update Ledger: SUCCESS]
    F --> H[Save Outbox Event: payment-completed / refund-processed]
    E -->|Failure| I[Transition Payment: FAILED / REFUND_FAILED]
    I --> J[Update Ledger: FAILED]
    I --> K[Save Outbox Event: payment-failed]
```

---

## 5. Defense-in-Depth Zero-Trust Security

1. **Network Layer Isolation**: Microservice internal ports (`8081-8089`) bind exclusively to `127.0.0.1` in Docker Compose and are isolated by Kubernetes `NetworkPolicy` ingress rules.
2. **Cryptographic Identity Assertion**:
   - `api-gateway` strips any client-injected `X-Gateway-*` and `X-Internal-*` headers.
   - For every authorized downstream request, `api-gateway` generates an HMAC-SHA256 token: `timestamp:nonce:signature`.
   - Internal services validate signature freshness (`|now - timestamp| <= 60000ms`) and cryptographic authenticity using constant-time evaluation. Unverified requests to internal admin APIs return HTTP 403 Forbidden.
