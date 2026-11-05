# Khandua Looms — Distributed Order Saga Workflow Specification

**Architecture Pattern:** Orchestrated Saga with Transactional Outbox & Scheduled Watchdog  
**Target Service:** `order-service`  
**Collaborating Services:** `inventory-service`, `payment-service`, `notification-service`, `audit-service`  
**Date:** November 2026  

---

## 1. Architectural Overview

In a distributed microservices ecosystem with isolated databases, a customer order spanning inventory reservation and payment processing cannot rely on two-phase commit (2PC) or distributed ACID transactions due to latency, lock contention, and availability trade-offs (Brewer's CAP Theorem). 

Khandua Looms implements an **Orchestrated Saga** backed by:
1. **Durable Saga State Machine (`SagaInstance`)**: Persisted in PostgreSQL (`order_schema.saga_instances`) with optimistic locking (`@Version`).
2. **Transactional Outbox**: All forward and compensating commands are written to `outbox_events` within the local ACID boundary.
3. **At-Least-Once Consumer Idempotency**: Handled by `IdempotentConsumerTemplate` using composite key `(event_id, consumer_group)`.
4. **Saga Watchdog Worker**: A background scheduler (`@Scheduled(fixedDelay = 60000)`) detecting stalled workflows past their 15-minute deadline (`deadline_at < NOW()`).

---

## 2. Saga State Machine & Step Transitions

### 2.1 State Definitions

| Saga Status | Step | Description | Next Allowed State |
| :--- | :--- | :--- | :--- |
| `STARTED` | `ORDER_CREATED` | Order entity created with `PENDING` status; outbox event emitted to reserve inventory. | `IN_PROGRESS`, `FAILED` |
| `IN_PROGRESS` | `INVENTORY_RESERVED` | `inventory.reserved` event received; outbox event emitted to initiate Razorpay payment. | `COMPLETED`, `COMPENSATING` |
| `COMPLETED` | `PAYMENT_CAPTURED` | `payment.captured` event received; order status transitioned to `COMPLETED`. | Terminal State |
| `COMPENSATING` | `COMPENSATING_INVENTORY` | `payment.failed` or watchdog timeout encountered; outbox event emitted to release reservation. | `COMPENSATED`, `FAILED` |
| `COMPENSATED` | `COMPLETED` | Compensation verified; order marked `CANCELLED`. | Terminal State |
| `FAILED` | `COMPLETED` | Non-recoverable failure or terminal compensation failure. | Terminal State |

```mermaid
stateDiagram-v2
    [*] --> STARTED: Order Created
    STARTED --> IN_PROGRESS: inventory.reserved
    STARTED --> COMPENSATING: inventory.reservation-failed / Timeout
    IN_PROGRESS --> COMPLETED: payment.captured
    IN_PROGRESS --> COMPENSATING: payment.failed / Timeout
    COMPENSATING --> COMPENSATED: inventory.released
    COMPENSATING --> FAILED: Compensation Retry Exhausted
    COMPLETED --> [*]
    COMPENSATED --> [*]
    FAILED --> [*]
```

---

## 3. End-to-End Workflow Sequences

### 3.1 Happy Path Sequence (Successful Order & Payment)

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Gateway as API Gateway
    participant Order as order-service
    participant OrderDB as order_schema (Postgres)
    participant Kafka as Apache Kafka
    participant Inventory as inventory-service
    participant Payment as payment-service

    Customer->>Gateway: POST /api/checkout/orders
    Gateway->>Order: Forward Request with X-User-* headers
    Order->>OrderDB: BEGIN TX: Insert orders, saga_instances (STARTED), outbox_events (order.created)
    OrderDB-->>Order: COMMIT TX
    Order-->>Customer: HTTP 201 Created (Order ID, Status: PENDING)

    Note over Order,Kafka: OutboxPublisher polls outbox_events (SKIP LOCKED)
    Order->>Kafka: Publish order.created
    Kafka->>Inventory: Consume order.created (Idempotent Consumer)
    Inventory->>Inventory: Atomic DB update (available >= qty)
    Inventory->>Kafka: Publish inventory.reserved (via Outbox)

    Kafka->>Order: Consume inventory.reserved
    Order->>OrderDB: Advance SagaInstance to IN_PROGRESS (INVENTORY_RESERVED)
    Order->>OrderDB: Update Order status to PAYMENT_PENDING
    OrderDB-->>Order: COMMIT TX

    Customer->>Payment: Pay via Razorpay & Verify (REST / Webhook)
    Payment->>Kafka: Publish payment.captured (via Outbox)

    Kafka->>Order: Consume payment.captured
    Order->>OrderDB: Advance SagaInstance to COMPLETED
    Order->>OrderDB: Update Order status to COMPLETED
    OrderDB-->>Order: COMMIT TX
```

---

### 3.2 Failure & Compensation Sequence (Payment Failed)

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Gateway as API Gateway
    participant Payment as payment-service
    participant Kafka as Apache Kafka
    participant Order as order-service
    participant OrderDB as order_schema (Postgres)
    participant Inventory as inventory-service

    Customer->>Gateway: POST /api/payment/verify (or Webhook)
    Gateway->>Payment: Verification fails or customer cancels
    Payment->>Kafka: Publish payment.failed (via Outbox)

    Kafka->>Order: Consume payment.failed
    Order->>OrderDB: BEGIN TX
    Order->>OrderDB: Advance SagaInstance to COMPENSATING
    Order->>OrderDB: Update Order status to CANCELLED
    Order->>OrderDB: Insert Outbox Event: inventory.release-reservation
    OrderDB-->>Order: COMMIT TX

    Note over Order,Kafka: OutboxPublisher dispatches compensation command
    Order->>Kafka: Publish inventory.release-reservation
    Kafka->>Inventory: Consume inventory.release-reservation
    Inventory->>Inventory: Atomic DB update (available += qty, reserved -= qty)
    Inventory->>Inventory: Update StockReservation status to RELEASED
    Inventory->>Kafka: Publish inventory.released
```

---

### 3.3 Overdue Saga Recovery Sequence (Saga Watchdog)

```mermaid
sequenceDiagram
    autonumber
    participant Watchdog as SagaWatchdogService (cron: 60s)
    participant OrderDB as order_schema (Postgres)
    participant Outbox as outbox_events
    participant Kafka as Apache Kafka
    participant Inventory as inventory-service

    Note over Watchdog: Scheduled trigger every 60,000 ms
    Watchdog->>OrderDB: SELECT * FROM saga_instances WHERE saga_status IN ('STARTED', 'IN_PROGRESS') AND deadline_at < NOW()
    OrderDB-->>Watchdog: Returns list of overdue SagaInstances

    loop For each overdue Saga
        Watchdog->>OrderDB: BEGIN TX
        Watchdog->>OrderDB: Update SagaInstance: saga_status = 'COMPENSATING'
        Watchdog->>OrderDB: Update orders: status = 'CANCELLED', cancellation_reason = 'Payment deadline exceeded (15 minutes)'
        Watchdog->>Outbox: INSERT outbox_events (inventory.release-reservation)
        OrderDB-->>Watchdog: COMMIT TX
    end

    Note over Outbox,Kafka: OutboxPublisher dispatches compensation
    Outbox->>Kafka: Publish inventory.release-reservation
    Kafka->>Inventory: Release held inventory
```

---

## 4. Source Code Traceability

| Component | File Path | Primary Function |
| :--- | :--- | :--- |
| **Saga Entity** | `order-service/src/main/java/.../model/SagaInstance.java` | Durable state entity with `@Version` optimistic locking and state validation. |
| **Saga Repository** | `order-service/src/main/java/.../repository/SagaInstanceRepository.java` | Custom query `findOverdueSagas(@Param("now") Instant now)`. |
| **Saga Orchestrator** | `order-service/src/main/java/.../service/OrderSagaOrchestrator.java` | Event listener coordinating transitions and compensation dispatches. |
| **Saga Watchdog** | `order-service/src/main/java/.../service/SagaWatchdogService.java` | Background worker recovering stalled workflows and releasing inventory. |
| **Flyway Schema** | `order-service/src/main/resources/db/migration/V4__saga_instances_and_outbox_upgrade.sql` | DDL table definitions and indexes on `(saga_status, deadline_at)`. |
| **Saga Unit Tests** | `order-service/src/test/java/.../SagaInstanceTest.java` & `SagaWatchdogServiceTest.java` | Automated tests verifying state transitions and timeout sweep. |
