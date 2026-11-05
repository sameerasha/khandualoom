# Observability Standards, Metrics, Tracing & SLO Framework

## Service Level Objectives (SLOs) & Error Budgets

Khandua Looms targets enterprise reliability for mission-critical e-commerce workflows:

| Service / Flow | Service Level Indicator (SLI) | Target SLO (Rolling 30-Day) | Monthly Error Budget |
| :--- | :--- | :--- | :--- |
| **API Gateway Ingress** | Proportion of HTTP responses < 500 | **99.95%** Availability | 21.6 minutes downtime |
| **Checkout Flow** | Successful order completions / Total checkouts | **99.90%** Success Rate | 43.2 minutes disruption |
| **Flash-Sale Reservation** | P95 latency of `/api/inventory/reserve` | **P95 < 200ms, P99 < 500ms** | 1% slow requests |
| **Payment Verification** | Authoritative capture/reconcile time | **P99 < 1,500ms** | 0.1% delayed |
| **Event Delivery (Outbox)** | Time from DB commit to Kafka publish | **P99 < 2,000ms** | 0.05% lag > 5s |

---

## 1. Distributed Tracing Architecture (OpenTelemetry + W3C)

Distributed transactions traverse HTTP edge calls, internal REST invocations, and asynchronous Kafka topics. We enforce end-to-end trace context propagation:

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Gateway as API Gateway
    participant OrderSvc as Order Service
    participant Outbox as Outbox Event Table
    participant Kafka as Kafka Topic
    participant InvSvc as Inventory Service

    Customer->>Gateway: POST /api/checkout (traceparent: 00-4bf92f35...-00)
    Gateway->>OrderSvc: POST /api/orders (injects traceparent + X-Correlation-ID)
    Note over OrderSvc: Extracts trace context into MDC & OpenTelemetry Span
    OrderSvc->>Outbox: INSERT INTO outbox_events (traceparent, correlation_id)
    OrderSvc-->>Gateway: 200 OK Order Placed
    Note over OrderSvc: Scheduled Outbox Publisher claims batch
    OrderSvc->>Kafka: ProducerRecord(topic, payload, headers: [traceparent, X-Correlation-ID])
    Kafka->>InvSvc: Record received
    Note over InvSvc: Extracts traceparent header; links child span in Tempo
```

---

## 2. Cardinality Control & Prometheus Memory Protection

High-cardinality tags (such as raw user input, order IDs, or unvetted query strings) cause exponential memory expansion in Prometheus TSDB.

### Sanitization Standard (`ProductMetricsService.java`)
```java
// Bounded tag allowlist: prevents arbitrary strings from creating unbounded metric series
private static final Set<String> ALLOWED_CATEGORIES = Set.of(
        "saree", "silk", "handloom", "cotton", "ikkat", "pasapalli", "bomkai", "other"
);

public void recordSearchQuery(String category) {
    String cleanCategory = (category != null && ALLOWED_CATEGORIES.contains(category.toLowerCase()))
            ? category.toLowerCase()
            : "other";
    meterRegistry.counter("khandualoom.product.searches", "category", cleanCategory).increment();
}
```

---

## 3. Core Golden Signal Metric Definitions

```yaml
# Ingress Rate & Errors
- alert: HighGatewayErrorRate
  expr: sum(rate(gateway_requests_total{status=~"5.."}[2m])) / sum(rate(gateway_requests_total[2m])) > 0.01
  for: 2m
  labels:
    severity: critical
  annotations:
    summary: "API Gateway 5xx error rate exceeded 1% for 2 minutes"

# Flash-Sale Sku Admission Saturation
- alert: SkuAdmissionControlThrottling
  expr: sum(rate(khandualoom_inventory_admission_control_rejected_total[1m])) > 100
  for: 1m
  labels:
    severity: warning
  annotations:
    summary: "Excessive SKU admission control rejections (> 100/s) during flash sale"

# Transactional Outbox Lag
- alert: OutboxPublishingStalled
  expr: sum(outbox_events_pending_total) > 500
  for: 3m
  labels:
    severity: critical
  annotations:
    summary: "Over 500 outbox records pending publication for > 3 minutes"
```
