# Khandua Looms — Infrastructure & Orchestration Guide

This directory contains the production-grade deployment manifests, container definitions, database initialization scripts, messaging topologies, and observability configurations for the **Khandua Looms** distributed microservices platform.

---

## Directory Architecture

```
infrastructure/
├── docker/
│   ├── Dockerfile.jvm              # Multi-stage Java 21 non-root layered runtime containerfile
│   └── docker-compose.infra.yml    # Standalone backing services compose (Postgres, Redis, Kafka, Tempo, Prometheus, Grafana)
├── grafana/
│   ├── dashboards/
│   │   └── microservices-overview.json # Real-time dashboard: throughput, latency (p95/p99), error rates, JVM heap
│   └── provisioning/
│       ├── dashboards/dashboards.yml   # Automatic dashboard provider configuration
│       └── datasources/datasources.yml # Automatic Prometheus & Tempo OTLP trace exemplar linking
├── kafka/
│   ├── init-topics.sh              # KRaft topic provisioning script with 6 partitions, 7d retention & DLTs (Linux/macOS)
│   └── init-topics.ps1             # KRaft topic provisioning script with 6 partitions, 7d retention & DLTs (PowerShell)
├── kubernetes/
│   ├── kustomization.yaml          # Kustomize manifest aggregating all cluster resources
│   ├── namespace.yaml              # Isolated 'khandualoom' namespace definition
│   ├── configmap-and-secrets.yaml  # Cluster-wide environment configs & secret templates
│   ├── deployments.yaml            # Pod specs, resource limits, readiness/liveness probes for all 9 microservices
│   ├── network-policy.yaml         # Zero-trust ingress/egress network isolation between pods and backing services
│   ├── pgbouncer.yaml              # PgBouncer transaction pooling multiplexer (10k client limit, 50 server pool)
│   └── pod-disruption-budget.yaml  # High-availability PDBs ensuring minAvailable: 1 during node drains
├── postgres/
│   ├── init-schemas.sql            # Idempotent creation of microservice schemas: auth, user, product, inventory, order, payment, notification, audit
│   └── service-roles.sql           # Principle of least privilege: dedicated DB users restricted to their own service schema
├── prometheus/
│   └── prometheus.yml              # Centralized scrape config for all 9 Spring Boot Actuator /actuator/prometheus endpoints
├── redis/
│   └── redis.conf                  # Hardened Redis 7 configuration: maxmemory-policy noeviction, AOF+RDB persistence
└── tempo/
    └── tempo.yml                   # Grafana Tempo distributed trace engine configuration (OTLP gRPC 4317, HTTP 4318)
```

---

## Component Details

### 1. Docker (`docker/`)
- **`Dockerfile.jvm`**: Multi-stage production container build using `eclipse-temurin:21-jre-alpine`.
  - Drops root privileges via system user `khandualoom:khandualoom`.
  - Extracts Spring Boot layers (`jarmode=layertools`) to maximize Docker layer cache hits.
  - Applies high-throughput JVM ergonomics: `-XX:+UseG1GC`, `-XX:MaxRAMPercentage=75.0`, `-XX:+ExitOnOutOfMemoryError`.
- **`docker-compose.infra.yml`**: Spins up all 7 backing infrastructure services without requiring local compilation of the microservice JARs.
  - Ideal for rapid local development in IntelliJ / Eclipse / VS Code.

### 2. Grafana & Observability (`grafana/`, `prometheus/`, `tempo/`)
- **Prometheus** scrapes metrics from all microservice endpoints (`/actuator/prometheus`) every 5 seconds.
- **Grafana Tempo** ingests OpenTelemetry traces via OTLP (W3C `traceparent` headers propagated across Kafka and HTTP REST calls).
- **Datasource Exemplars**: Clicking on a latency spike in Grafana immediately pivots to the corresponding OpenTelemetry trace in Tempo.

### 3. Kafka Provisioning (`kafka/`)
- KRaft mode (no Zookeeper dependency) with automated topic provisioning.
- Topics are pre-allocated with **6 partitions** to support horizontal scaling across consumer groups.
- Enforces dedicated Dead Letter Topics (`.DLT`) for poison-pill recovery and non-blocking retry topics.

### 4. Kubernetes (`kubernetes/`)
- Production-ready cloud orchestration with zero-trust network policies.
- Enforces Spring Boot Actuator health checks:
  - Liveness probe: `/actuator/health/liveness`
  - Readiness probe: `/actuator/health/readiness`
- Integrated **PgBouncer** connection multiplexer preventing PostgreSQL connection starvation under high concurrent traffic.

### 5. PostgreSQL (`postgres/`)
- Pre-creates isolated schema namespaces per microservice:
  - `auth_schema`, `user_schema`, `product_schema`, `inventory_schema`, `order_schema`, `payment_schema`, `notification_schema`, `audit_schema`.
- Includes `service-roles.sql` to enforce database-level boundaries so no service can query another service's tables.

### 6. Redis (`redis/`)
- Hardened for distributed inventory admission control and replay nonce defense:
  - `maxmemory-policy noeviction`: Ensures admission tokens and replay nonces are never dropped prematurely.
  - `appendonly yes` (AOF) + RDB snapshots for persistence across pod restarts.

---

## Quickstart Commands

### Option A: Run Backing Infrastructure Only (Local IDE Development)
```bash
# From repository root:
docker compose -f infrastructure/docker/docker-compose.infra.yml up -d

# Verify all services are healthy:
docker compose -f infrastructure/docker/docker-compose.infra.yml ps

# Provision Kafka topics:
# On Linux/macOS:
./infrastructure/kafka/init-topics.sh
# On Windows PowerShell:
.\infrastructure\kafka\init-topics.ps1
```

### Option B: Run Full Platform via Docker Compose
```bash
# Starts all 9 microservices + frontend + backing infrastructure:
docker compose up -d --build
```

### Option C: Deploy to Kubernetes Cluster
```bash
kubectl apply -k infrastructure/kubernetes/
```
