# Transactional Outbox: Polling Publisher vs Debezium CDC

## Overview

The Transactional Outbox pattern guarantees reliable, dual-write-free event publishing between PostgreSQL and Apache Kafka. This document analyzes the trade-offs between our current Scheduled SQL Polling implementation and Debezium Change Data Capture (CDC).

---

## 1. Comparative Architecture

### Scheduled SQL Polling (`FOR UPDATE SKIP LOCKED`)
```text
Application Transaction [Business Entity + Outbox Record] -> COMMIT
                    │
                    ▼ (1000ms fixedDelay)
Scheduled Publisher Thread -> SELECT ... FOR UPDATE SKIP LOCKED
                    │
                    ▼
KafkaTemplate.send(topic, payload) -> UPDATE outbox SET status='PUBLISHED'
```

### Debezium Change Data Capture (CDC)
```text
Application Transaction [Business Entity + Outbox Record] -> COMMIT
                    │
                    ▼
PostgreSQL WAL (Write-Ahead Log)
                    │
                    ▼ (Streaming logical decoding via pgoutput)
Kafka Connect (Debezium Postgres Connector)
                    │
                    ▼
Kafka Topic (Latency: < 15ms)
```

---

## 2. Trade-Off Analysis

| Architectural Metric | Scheduled Polling (`SKIP LOCKED`) | Debezium CDC (Logical Decoding) |
| :--- | :--- | :--- |
| **End-to-End Latency** | 500ms – 1,500ms (governed by poll interval) | 5ms – 25ms (streamed directly from WAL) |
| **Database Read IOPS** | Constant baseline queries (`SELECT` every second) | Zero table read queries; reads sequential WAL stream |
| **Database Write Amplification** | Double write: `INSERT` outbox row + `UPDATE` status to `PUBLISHED` | Single write: `INSERT` outbox row only (event router can auto-tombstone) |
| **Connection Overhead** | Consumes 1 HikariCP connection per batch execution | Single long-lived replication slot connection per database |
| **WAL Retention / Bloat Risk** | None; regular MVCC vacuuming cleans deleted rows | **High Risk**: If Kafka Connect crashes or replication stalls, WAL accumulates on disk until disk fills |
| **Operational Stack** | Zero external components; runs inside existing Spring Boot JVM | Requires Kafka Connect cluster, schema registry connector, replication slot monitoring |
| **Schema Evolution** | Handled seamlessly via Flyway migrations | Requires connector schema registry schema management |

---

## 3. Threshold Analysis & Evolution Roadmap for Khandua Looms

### Current Phase (< 25,000 orders/day)
- **Selection**: **Scheduled Polling with `FOR UPDATE SKIP LOCKED`**.
- **Justification**:
  - The 1-second publishing latency is completely acceptable for asynchronous inventory confirmation and customer notifications.
  - With batch claims of 50 records and indexed status queries (`idx_order_outbox_status_created`), CPU utilization on PostgreSQL is < 1.2%.
  - Zero external infrastructure dependency; eliminates Kafka Connect operations and WAL disk fill failure modes.

### Target Transition Threshold (> 50,000 orders/day or Flash-Sale SLA < 100ms)
When peak flash sales require inventory reservation confirmations to reach customer browsers within 50ms:
1. Enable `wal_level = logical` and `max_replication_slots = 10` on PostgreSQL.
2. Deploy Debezium on Strimzi Kafka Connect with the Outbox Event Router SMT (Single Message Transform).
3. Implement automated Prometheus alerting on `pg_replication_slots.wal_status` and replication lag bytes to avert disk saturation.
