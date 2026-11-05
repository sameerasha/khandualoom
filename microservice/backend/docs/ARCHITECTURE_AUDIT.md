# Khandua Looms — Enterprise Architecture Audit & Gap Analysis

**Date:** November 2026  
**Auditor:** Principal Software Architect & Senior Distributed Systems Engineer  
**Scope:** 20-Module Maven Repository (`microservice-parent`), 9 Microservices, Shared Libraries, Database Schemas, Event Streaming & Deployment Configs.

---

## 1. Executive Summary

A comprehensive repository-wide audit was conducted across all 20 Maven modules of the Khandua Looms backend platform. While the structural decomposition into 9 microservices, isolated PostgreSQL schemas, and shared aggregator libraries has established solid architectural boundaries, **critical runtime reliability, concurrency, and distributed consistency vulnerabilities** exist in the current implementation.

Most notably, event publishing across `payment-service` and `inventory-service` executes directly via `KafkaTemplate` within active database transactions rather than utilizing the Transactional Outbox. Furthermore, dual-path payment verification (REST vs Webhook) lacks an idempotent unified observation service, `order-service` lacks persistent Saga state tracking, and inventory reservation relies on read-modify-write loops susceptible to race conditions during flash-sale traffic.

---

## 2. Comprehensive Audit Findings

### 2.1 Critical Severity (P0)

| ID | Module / Service | Area | Finding & Impact | Required Remediation |
| :--- | :--- | :--- | :--- | :--- |
| **P0-1** | `payment-service` | Dual Verification Disparity | REST verification (`/api/payment/verify`) and Razorpay webhooks have no unified observation pipeline. Concurrent webhook delivery and frontend submission can lead to race conditions, duplicate captures, or unhandled out-of-order events. | Implement `PaymentApplicationService.recordPaymentObservation()` unifying REST and webhook inputs with constant-time HMAC-SHA256 signature verification. |
| **P0-2** | `payment-service` | Payment State Machine & Constraints | Payment status is represented as loose strings (`INITIATED`, `SUCCESS`, `failed`). Database table lacks unique constraints on `razorpay_payment_id`, webhook event ID, and internal idempotency key. | Implement strict enum `PaymentStatus` with formal transition validation (`CREATED -> PENDING -> AUTHORIZED -> CAPTURED -> FAILED/CANCELLED/REFUNDED`). Add unique database indexes. |
| **P0-3** | `payment-service` | Reconciliation & Late Payment Flow | If a 15-minute inventory reservation expires and the user's payment arrives at 17 minutes, the system has no reconciliation logic to re-verify stock availability or trigger an automated refund. | Implement `PaymentReconciliationService` to detect orphaned payments, check inventory re-reservation, recover orders if stock allows, or initiate and track automated customer refunds. |
| **P0-4** | `inventory-service` | Concurrency & Race Conditions | `reserveStock()` performs read-modify-write (`findByProductId` + `save`). Under concurrent flash-sale checkout, this can cause deadlocks or overselling. | Implement atomic conditional database updates (`UPDATE ... SET available_quantity = available_quantity - :qty, reserved_quantity = reserved_quantity + :qty WHERE product_id = :id AND available_quantity >= :qty`). |
| **P0-5** | `inventory-service` & `payment-service` | Synchronous Kafka in DB Transaction | Direct `kafkaTemplate.send()` calls are placed inside `@Transactional` methods. Broker latency holds database connections hostage; broker outages rollback valid business state, or emit phantom events on commit failure. | Enforce Transactional Outbox pattern: save outbox events in the same database transaction as domain mutations; dispatch asynchronously. |
| **P0-6** | `order-service` | Ephemeral Saga State & No Watchdog | `OrderSagaOrchestrator` updates `Order` directly without a durable `SagaInstance` entity. In-flight Sagas cannot be recovered if the service restarts, leaving orders permanently stranded in `PENDING` or `PAYMENT_PENDING`. | Implement persistent `SagaInstance` entity (`sagaId`, `orderId`, `currentStep`, `sagaStatus`, `deadlineAt`, `retryCount`), optimistic locking, and a scheduled `SagaWatchdog` to recover or compensate overdue workflows. |
| **P0-7** | `order-service` | Monolithic Code Duplication | `order-service` still contains a legacy `PaymentController` and `PaymentService` from before `payment-service` extraction. | Remove duplicate controllers from `order-service` to ensure `payment-service` remains the sole authority for payments. |

---

### 2.2 High Severity (P1)

| ID | Module / Service | Area | Finding & Impact | Required Remediation |
| :--- | :--- | :--- | :--- | :--- |
| **P1-1** | `common-messaging` | Consumer Idempotency Primary Key | `ProcessedEvent` defines `@Id private UUID eventId`. When multiple microservices (different consumer groups) process the same broadcast event, this fails or creates collisions if shared. | Introduce composite primary key `(eventId, consumerGroup)` to ensure proper per-service idempotency. |
| **P1-2** | `infrastructure/postgres` | Superuser Role Usage | All microservices connect using the `postgres` superuser. Any SQL injection or credential breach grants full cross-schema read/write access. | Author least-privilege PostgreSQL roles (`auth_role`, `payment_role`, `order_role`, etc.) with permissions restricted solely to each service's isolated schema. |
| **P1-3** | `common-messaging` | Outbox Batch Claiming | Existing outbox publishing logic lacks `FOR UPDATE SKIP LOCKED`, exponential backoff with jitter, retry caps, and dead-letter routing for poisoned messages. | Upgrade `OutboxPublisher` with non-blocking concurrency claiming and dead-letter outbox state. |
| **P1-4** | `*` (All Services) | Test Coverage Absence | Entire project has almost zero automated unit or integration tests for core business paths (payment verification, inventory reservation, Saga transitions). | Build comprehensive JUnit 5 and Testcontainers test suites verifying all critical paths. |

---

### 2.3 Medium Severity (P2)

| ID | Module / Service | Area | Finding & Impact | Required Remediation |
| :--- | :--- | :--- | :--- | :--- |
| **P2-1** | `product-service` | Cache Stampede & Invalidation | Redis product cache lacks probabilistic early expiration (XFetch) or distributed locking, risking cache stampedes during flash sales. | Add stampede guard and versioned cache keys. |
| **P2-2** | `auth-service` | Symmetric Secret Distribution | Downstream services rely on shared HMAC-SHA256 secret. Compromise of one service's configuration allows forging valid JWTs. | Transition to asymmetric RS256/ES256 signing with JWKS endpoint in `auth-service`. |

---

## 3. Implementation Plan & Sprint Roadmap

- **Sprint 1 (Critical Correctness - P0)**:
  1. `payment-service`: Unified `recordPaymentObservation()`, strict `PaymentStatus` state machine, unique DB constraints, and payment reconciliation workflow.
  2. `inventory-service`: Atomic conditional inventory updates, formal `ReservationStatus` lifecycle, and Outbox integration.
  3. `order-service`: Durable `SagaInstance` persistence, `SagaWatchdog` worker, and removal of duplicate payment controllers.
- **Sprint 2 (Messaging Reliability - P0/P1)**:
  1. `common-messaging`: Composite key on `ProcessedEvent`, outbox batch claiming with `FOR UPDATE SKIP LOCKED`.
  2. Implement Outbox Publisher in `payment-service` and `inventory-service`.
- **Sprint 3 (Security & Database Isolation - P1)**:
  1. PostgreSQL least-privilege role scripts (`service-roles.sql`).
  2. Auth service refresh token family isolation.
- **Sprint 4 (Testing & Quality Assurance)**:
  1. Unit tests for payment state machine and reconciliation.
  2. Concurrency and atomic reservation tests for inventory.
  3. Saga state machine and compensation integration tests.
- **Sprint 5 (Documentation & Implementation Report)**:
  1. Architecture documentation suite in `docs/`.
  2. Final `docs/IMPLEMENTATION_REPORT.md`.
