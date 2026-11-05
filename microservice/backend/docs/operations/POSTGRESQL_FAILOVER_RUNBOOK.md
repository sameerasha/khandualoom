# PostgreSQL Automated & Manual Failover Runbook

## Objective & SLA

This runbook defines the operational protocol for handling PostgreSQL primary node failures supporting the Khandua Looms microservices cluster.
- **Recovery Point Objective (RPO)**: < 5 seconds of data loss (Synchronous / Near-Sync Streaming Replication).
- **Recovery Time Objective (RTO)**: < 60 seconds (Automated Patroni / AWS RDS Multi-AZ switchover).

---

## 1. Failure Detection & Health Verification

### Automated Alert Triggers
- `PgsqlPrimaryUnreachable`: PagerDuty alert firing after 3 failed Actuator health checks across 3 microservices simultaneously.
- `PgsqlReplicationLagHigh`: Replication lag exceeds 50MB or 10 seconds.

### Immediate Manual Health Diagnostics
Run from the Bastion host:
```bash
# Check PostgreSQL replication state
psql -h pg-primary.internal -U postgres -c "SELECT client_addr, state, sync_state, replay_lag FROM pg_stat_replication;"

# Verify connection from order-service pod
kubectl exec -it deployment/order-service -n khandualoom -- nc -zv pg-primary.internal 5432
```

---

## 2. Automated vs Manual Failover Execution

### Scenario A: AWS RDS Multi-AZ Automated Failover
AWS RDS automatically promotes the standby replica in the second Availability Zone. DNS CNAME `khandualoom-db.internal` updates automatically within 30-45 seconds.

### Scenario B: Self-Hosted Patroni / CloudNative-PG Promotion
If automated failover does not trigger:
```bash
# 1. Promote Standby Replica to Primary
patronictl -c /etc/patroni/khandualoom.yml failover khandualoom-cluster --candidate pg-standby-01 --force

# 2. Verify promotion
psql -h pg-standby-01.internal -U postgres -c "SELECT pg_is_in_recovery();"
# Output MUST be 'f' (false indicates read-write primary)
```

---

## 3. Microservice HikariCP Connection Pool Reconnection

Our microservices are tuned to survive transient database failovers without requiring pod restarts:

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 25
      minimum-idle: 5
      connection-timeout: 10000     # 10s wait before throwing exception
      validation-timeout: 3000       # Fast heartbeat check
      max-lifetime: 1800000          # 30m connection recycle
      idle-timeout: 300000           # 5m idle cleanup
```

### JDBC Driver Configuration
Ensure all service JDBC URLs include failover parameters:
```text
jdbc:postgresql://pg-primary.internal:5432,pg-standby.internal:5432/khandualoom_db?targetServerType=primary&tcpKeepAlive=true&socketTimeout=30
```

---

## 4. Post-Failover Integrity Verification Checklist

After failover completion, execute the following 5 verification steps:

1. **Verify Outbox Drain**:
   Ensure `outbox_events` are publishing normally and not accumulating:
   ```sql
   SELECT count(*) FROM order_schema.outbox_events WHERE status = 'PENDING';
   SELECT count(*) FROM payment_schema.outbox_events WHERE status = 'PENDING';
   ```
2. **Verify Saga Watchdog**:
   Inspect `order-service` logs for overdue saga sweeps:
   ```bash
   kubectl logs -l app=order-service -n khandualoom --tail=100 | grep "Saga Watchdog"
   ```
3. **Check for Duplicate Sequences**:
   Verify identity sequences (`orders_id_seq`) are intact and ahead of current maximum table IDs.
4. **Inspect Payment Operation Ledger**:
   Check for any in-flight payments stuck in `INITIATED` status and trigger automated reconciliation:
   ```sql
   SELECT * FROM payment_schema.payment_operation_ledger WHERE status = 'INITIATED' AND created_at < NOW() - INTERVAL '5 minutes';
   ```
5. **Actuator Health Status**:
   Confirm all 9 microservices report `{"status":"UP"}` on `/actuator/health`.
