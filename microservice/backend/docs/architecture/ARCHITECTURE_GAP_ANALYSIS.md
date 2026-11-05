# Khandua Looms – Architecture Gap Analysis

## Executive Summary

This gap analysis compares the existing 20-module backend implementation of the **Khandua Looms** distributed e-commerce platform against the target production-grade architecture. The objective is to identify precise defects, missing capabilities, race conditions, and scaling limitations across all system pillars, establishing an exact implementation blueprint to achieve full production readiness.

---

## 1. Comprehensive Architectural Gap Matrix

| Improvement Area | Current Implementation | Identified Gap | Required Change | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **A. Distributed Inventory Admission Control** | `SkuAdmissionControl` uses an in-memory `ConcurrentHashMap<Long, Semaphore>` with 50 permits per SKU per pod. | When scaled horizontally to $N$ pod replicas, permits multiply ($50 \times N$), flooding PostgreSQL row locks during flash sales. | Implement distributed atomic Token Bucket via Redis Lua script using server time (`redis.call('TIME')`). Retain local JVM semaphore for defense-in-depth. Fail closed to local limits if Redis fails. | **P0** |
| **B. Multi-SKU Deadlock Prevention** | Multi-item orders in `InventoryService.processOrderReservation` iterate and lock SKUs in arbitrary payload arrival order. | Concurrent orders with overlapping SKUs in reverse order (e.g., `[A, B]` vs `[B, A]`) cause PostgreSQL deadlocks (`40P01`). | Enforce canonical lock ordering by sorting SKU IDs ascending prior to locking. Add bounded retries with exponential backoff and jitter for transient lock contention. Add concurrent multi-SKU tests. | **P0** |
| **C. Saga & Payment Concurrency Protection** | `OrderSagaOrchestrator` uses optimistic locking on `Order` and `SagaInstanceRepository.findOverdueSagas` uses `SKIP LOCKED`. | If a payment callback races with watchdog timeout, watchdog reads order without lock, potentially saving duplicate compensation outbox commands or failing to commit saga state atomically with outbox. | Ensure Saga state transitions and compensation Outbox events are committed atomically within the same ACID transaction. Handle unknown gateway states with idempotent retry checks. | **P0** |
| **D. Financial Reconciliation & Settlement** | `payment_operation_ledger` tracks `CREATE_ORDER`, `CAPTURE`, `REFUND_INITIATE`, and `REFUND_WEBHOOK`. | Settlement tracking (fees, GST, settlement UTR, settlement ID) is completely missing. No batch reconciliation service to ingest Razorpay settlement files, identify unmatched transactions, or flag discrepancy amounts. | Create `payment_settlement_ledger` table and entity. Add automated settlement reconciliation service with discrepancy tracking (fees, deductions). Ensure settlement mismatches NEVER alter order or inventory state. | **P0** |
| **E. Internal Security & Nonce Replay Protection** | `InternalAssertionTokenService` generates `timestamp:nonce:signature` signing only timestamp and nonce with a single secret. | Signature does not bind HTTP method, canonical path, body hash, caller, or recipient. Tokens can be replayed within 60s window. Single secret prevents zero-downtime key rotation. | Sign `method + canonicalPath + sha256(body) + caller + recipient + timestamp + nonce`. Add atomic nonce replay cache with 60s TTL. Support primary and secondary keys for seamless rotation. | **P0** |
| **F. Transactional Outbox Leases & Archival** | Outbox publishers use `claimPendingBatch` with `SKIP LOCKED`, retrying `FAILED` events. | No publisher lease timeout (if pod crashes during send, locks remain until timeout). No backlog-based backpressure. No automated archival of millions of `PUBLISHED` rows. | Introduce publisher lease owner and expiration in `outbox_events`. Add backlog gauge metric `khandualoom_outbox_backlog_count` and oldest event age alert. Implement scheduled archival for `PUBLISHED` rows > 7 days. | **P1** |
| **G. Kafka Reliability & Consumer Idempotency** | Kafka consumers use `IdempotentConsumerTemplate` with `processed_events` table and deterministic IDs. | In-flight messages lack aggregate sequence numbers. Offset commit mode must be strictly verified as manual/record after DB transaction. DLQ events lack rich context headers (exception cause, original topic). | Ensure Kafka offset commit occurs strictly post-transaction (`AckMode.RECORD`). Enhance DLQ records with `X-Exception-Message`, `X-Original-Topic`, and retry count headers. | **P1** |
| **H. PostgreSQL Performance & Autovacuum** | Database schemas have basic indexes; tables lack table-level autovacuum tuning. | High-churn tables (`outbox_events`, `stock_reservations`) suffer MVCC table bloat under high transaction volumes. Default autovacuum triggers too late (20% scale factor). | Add Flyway migration tuning `autovacuum_vacuum_scale_factor = 0.05` and `autovacuum_vacuum_cost_limit = 1000` on high-churn tables. Review and optimize composite indexes. | **P1** |
| **I. Redis Resilience & Fallback** | `product-service` utilizes Redis caching; `inventory-service` will use it for admission control. | Potential for cache stampede on expired hot products; unhandled Redis outages could cause unhandled exceptions instead of graceful fallback. | Configure strict connection/read timeouts (100ms for admission control). Implement safe fallback: if Redis is unavailable, admission control falls back to strict local JVM semaphore; cache falls back to DB. | **P1** |
| **J. Kubernetes & Operational Resilience** | Basic Kubernetes manifests exist (`deployments.yaml`, `network-policy.yaml`). | Missing PodDisruptionBudgets (PDB). Missing explicit graceful shutdown configs for Spring Boot and Kafka listeners. Pod termination can drop in-flight transactions. | Add `pod-disruption-budget.yaml` with `minAvailable: 1`. Configure `server.shutdown: graceful` and `spring.lifecycle.timeout-per-shutdown-phase: 30s` across all services. | **P1** |
| **K. Observability & SLO Metrics** | Prometheus metrics configured; sanitized categories in product searches. | Missing business metrics for flash-sale admission rejections, late payment reconciliations, settlement discrepancies, and outbox queue age. | Instrument Micrometer gauges and counters for: `khandualoom_inventory_admission_rejections`, `khandualoom_saga_watchdog_recoveries`, `khandualoom_reconciliation_discrepancies`, and `khandualoom_outbox_oldest_event_age`. | **P1** |
| **L. Disaster Recovery & Runbooks** | Runbooks created for PostgreSQL failover and multi-AZ deployment. | Fencing requirements (split-brain prevention during regional failover) lack explicit operational runbook procedures. Single-writer ownership must be formalized. | Document single-writer ownership rules, fencing procedures, and zero-data-loss RPO/RTO verification workflows. | **P2** |

---

## 2. Detailed Findings by Architecture Pillar

### Pillar A: Distributed Inventory Admission Control
- **Defect**: In-memory `Semaphore(50)` allows 50 concurrent requests per pod. If 10 pods are active, up to 500 requests concurrently execute `UPDATE inventory_items WHERE product_id = 101`, causing extreme row lock queueing in PostgreSQL and connection pool exhaustion.
- **Resolution**: A distributed token bucket implemented via a Redis Lua script (`inventory:admission:{sku}`) provides a single cluster-wide admission limit. Server-side time in Redis (`redis.call('TIME')`) prevents clock drift issues across pods. If Redis is down, the system gracefully falls back to a conservative local JVM semaphore (e.g. 10 requests per pod) rather than crashing or permitting unbounded DB load.

### Pillar B: Multi-SKU Deadlock Prevention
- **Defect**: In `InventoryService.processOrderReservation`, ordered items are processed sequentially in whatever order the customer or frontend submitted them. Two simultaneous checkout requests containing identical items in opposing orders (`[SKU_1, SKU_2]` vs `[SKU_2, SKU_1]`) cause a PostgreSQL deadlock error `40P01`.
- **Resolution**: Sort all `OrderItemEvent` items by `productId` ascending before acquiring admission control permits and before executing row updates. Add bounded retry logic with jitter for `40P01` / `CannotAcquireLockException`.

### Pillar C: Saga and Payment Concurrency Protection
- **Defect**: When payment confirmation arrives simultaneously with a 15-minute watchdog sweep, watchdog may read a stale order state if locks are not handled consistently.
- **Resolution**: Leverage optimistic locking (`@Version`) with deterministic handling in `OrderSagaOrchestrator` and `SagaWatchdogService`. Ensure that outbox compensation commands and order state transitions execute inside the exact same `@Transactional` boundary.

### Pillar D: Financial Reconciliation & Settlement
- **Defect**: Payment capture is recorded, but merchant settlement (money transfer from Razorpay to bank account after fee deduction) is completely unmanaged.
- **Resolution**: Introduce `payment_settlement_ledger` to record settlement IDs, gross amounts, fees, tax, net amounts, and settlement status. Implement a batch reconciliation engine capable of detecting discrepancies without touching order or inventory statuses.

### Pillar E: Zero-Trust Security & Nonce Replay
- **Defect**: Cryptographic assertion tokens sign only `timestamp + ":" + nonce`. Replays within the 60-second window are possible because nonces are not recorded, and method/path/body are unsigned.
- **Resolution**: Bind token signature to `method + "|" + path + "|" + sha256(body) + "|" + timestamp + "|" + nonce`. Store used nonces in a bounded TTL cache (60s expiry) to guarantee single-use. Support dual-key configuration for seamless key rotation.

---

## 3. Implementation Plan by Priority

1. **P0 (Critical Correctness & Security)**:
   - A: Distributed Inventory Admission Control (Redis Lua + JVM Fallback).
   - B: Multi-SKU Canonical Lock Ordering & Deadlock Retry.
   - C: Saga & Payment Concurrency Hardening.
   - D: Financial Settlement Ledger & Idempotent Reconciliation.
   - E: Enhanced Cryptographic Assertion Signing & Nonce Replay Defense.
2. **P1 (Reliability & Performance)**:
   - F: Transactional Outbox Leases, Backpressure, and Retention Cleanup.
   - G: Kafka Manual Offset Acknowledgment & DLQ Metadata.
   - H: PostgreSQL High-Churn Autovacuum Tuning & Composite Indexes.
   - I: Redis Resilience & Cache Timeout Protection.
   - J: Kubernetes PodDisruptionBudget & Graceful Shutdown.
   - K: Observability & SLO Golden Signal Metrics.
3. **P2 (Operational Maturity)**:
   - L: Disaster Recovery Single-Writer Ownership & Fencing Documentation.
