# Khandua Looms — Production Hardening & Architecture Assessment

**Author:** Principal Enterprise Software Architect & Staff Distributed Systems Engineer  
**Scope:** 20-Module Maven Repository (`microservice-parent`), 9 Microservices, Database Schemas, Event Mesh, Security Posture, and Cloud-Native Infrastructure  
**Baseline Maturity Score:** 78 / 100  
**Target Maturity Score:** 95+ / 100  
**Date:** November 2026  

---

## 1. Executive Summary

An exhaustive technical evaluation of the Khandua Looms distributed e-commerce backend platform was conducted. While earlier phases established sound Domain-Driven Design (DDD), Hexagonal Architecture, Transactional Outbox, and conditional SQL stock updates, scaling the system to **100,000+ daily orders, 10,000 RPS flash-sale surges, 99.99% availability, and strict financial correctness** requires hardening five foundational distributed pillars:

1. **Deterministic Saga & Payment Arbitration:** Establishing immutable, non-overwriting state arbitration when payment capture and watchdog timeouts race at boundary conditions.
2. **Durable Payment Operation Ledger:** Tracking every gateway attempt, request hash, idempotency token, and asynchronous refund webhook (`refund.processed`, `refund.failed`).
3. **Per-SKU Flash-Sale Admission Control:** Preventing 10,000 concurrent threads from saturating PostgreSQL row locks on a single rare saree SKU via bounded admission queues and backpressure (HTTP 429).
4. **Cryptographic Zero-Trust Internal Security:** Replacing static gateway headers with short-lived, signed internal service assertions with timestamp skew protection.
5. **End-to-End W3C Trace Propagation:** Bridging OpenTelemetry traces across asynchronous Outbox tables and Kafka message headers into Grafana Tempo.

---

## 2. Comprehensive Findings Matrix

| Finding ID | Severity | Affected Module | Target Class / File | Existing Behavior | Defect or Operational Risk | Proposed Change | Expected Business Impact |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **P0** | `api-gateway` & `common-security` | `JwtAuthGatewayFilter.java` | Injects static header `X-Gateway-Identity: khandualoom-gateway-verified`. | Static string can be spoofed if internal network is bridged. Gateway does not strip client-supplied `X-Gateway-*` headers. | Strip incoming `X-Internal-*` headers at gateway; sign an HMAC-SHA256 internal assertion token with 60s validity and timestamp. | Zero unauthorized internal access; complete defense-in-depth. |
| **SAGA-01**| **P0** | `order-service` | `OrderSagaOrchestrator.java` & `SagaWatchdogService.java` | Watchdog cancels order if `deadline_at < NOW()`; payment completion confirms order. | If payment succeeds at second 899 and webhook arrives at second 901, watchdog marks order `CANCELLED` while payment marks `CONFIRMED`. Non-deterministic state. | Implement deterministic arbitration: if `Order` is `CANCELLED`, payment event is routed to `PaymentReconciliationService` for stock check or auto-refund. Add fencing token. | Zero stranded payments; deterministic customer outcome. |
| **PAY-01** | **P0** | `payment-service` | `PaymentApplicationService.java` | Updates `Payment` entity directly without tracking individual gateway API attempts or request hashes. | Network timeouts during Razorpay capture or refund leave system unsure whether transaction reached gateway. | Introduce `PaymentOperationLedger` entity tracking every operation, idempotency key, request hash, and gateway response. | Complete financial auditability and safe timeout reconciliation. |
| **PAY-02** | **P0** | `payment-service` | `PaymentController.java` & `PaymentApplicationService.java` | Webhook controller only listens for `payment.captured` and `payment.failed`. | Razorpay asynchronous refund events (`refund.processed`, `refund.failed`) are ignored. Bank refund failures go undetected. | Add webhook handlers for `refund.processed` and `refund.failed` updating ledger and alerting ops on failure. | Authoritative refund lifecycle tracking; zero silent banking refund dropoffs. |
| **INV-01** | **P0** | `inventory-service` | `SpringDataInventoryRepository.java` | Relies solely on row-level conditional SQL (`WHERE available_stock >= :qty`). | Under 10,000 req/sec flash-sale traffic for 1 rare saree, 10,000 threads queue on the same Postgres row, exhausting connection pool and triggering HTTP 504 timeouts. | Implement `SkuAdmissionControl`: bounded concurrency (max 50 concurrent DB reservations per SKU) with fast-fail HTTP 429 and `Retry-After`. | Protects database from connection exhaustion; guarantees sub-50ms rejection for sold-out items. |
| **OUT-01** | **P1** | `common-messaging` | `AbstractOutboxEntity.java` | Stores payload JSON but lacks dedicated columns for distributed tracing context. | Asynchronous workflows lose W3C trace correlation in Grafana Tempo when passing through Outbox tables. | Add dedicated columns: `traceparent`, `tracestate`, `correlation_id`, `causation_id`. Inject into Kafka record headers. | 100% end-to-end distributed trace continuity from customer click to async notification. |
| **OPS-01** | **P1** | `infrastructure/kubernetes` | `deployments.yaml` | Basic replicas defined without PodAntiAffinity, TopologySpreadConstraints, or PodDisruptionBudgets. | Multiple replicas of the same service can be scheduled on a single Kubernetes node, causing downtime during node eviction. | Add `PodDisruptionBudget` (minAvailable: 1), `topologySpreadConstraints` (zone/host), and graceful shutdown configurations. | Eliminates single-node failure blast radius; advances toward 99.99% availability SLO. |
| **OBS-01** | **P1** | `*` (All Services) | Actuator / Metrics | Custom metrics scattered; missing SLA/SLO tracking for Saga duration and payment UNKNOWN states. | Blind spots during production incidents; inability to alert before customers experience checkout failures. | Implement dedicated Micrometer meters: `saga.pending.duration`, `payment.unknown.total`, `inventory.admission.rejected`, and `outbox.oldest.age.seconds`. | Proactive SLO alerting; mean time to detect (MTTD) reduced to < 30 seconds. |

---

## 3. Prioritized Implementation Roadmap

- **Phase 2 (Immediate — P0):** Saga state machine arbitration and watchdog leasing.
- **Phase 3 (Immediate — P0):** Durable payment operation ledger and authoritative refund webhook ingestion.
- **Phase 4 (Immediate — P0):** Flash-sale per-SKU admission control and backpressure.
- **Phase 5 (Immediate — P0):** Cryptographic zero-trust internal assertion token and header stripping.
- **Phase 6–9 (P1):** Trace context propagation, connection pool budgets, and observability SLO dashboards.
- **Phase 10–12 (P2 & Verification):** Service mesh evaluation, CDC evaluation, and final production certification.
