# Khandua Looms — Infrastructure & Orchestration Architecture

This directory is the single canonical source of truth for production-grade deployment manifests, container definitions, database initialization scripts, messaging topologies, and observability configurations for the **Khandua Looms** distributed microservices platform.

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
├── kubernetes/                     # Canonical Kustomize Multi-Environment Orchestration
│   ├── base/                       # Shared Core Deployments & Services (All 9 Microservices + Frontend)
│   │   ├── kustomization.yaml      # Base resource aggregator
│   │   ├── namespace.yaml          # Isolated 'khandualoom' namespace
│   │   ├── configmap-and-secrets.yaml # Cluster DNS service endpoints & secret templates
│   │   ├── deployments.yaml        # Pod specs, health probes, non-root securityContext, graceful shutdown
│   │   └── network-policy.yaml     # Zero-trust inter-pod network isolation
│   ├── components/                 # Reusable Optional Infrastructure Capabilities
│   │   ├── hpa/                    # Autoscaling (autoscaling/v2) scaling 2 to 10 replicas on CPU/RAM targets
│   │   ├── in-cluster-infra/       # Optional in-cluster Postgres, Redis, Kafka KRaft, Kafka-UI (for dev/local k8s)
│   │   ├── ingress/                # Ingress (networking.k8s.io/v1) with TLS termination & domain routing
│   │   ├── pgbouncer/              # PgBouncer connection multiplexer (10k client connections, 50 server pool)
│   │   └── pod-disruption-budget/  # High-availability PDBs (minAvailable: 1) covering all 9 microservices
│   ├── overlays/                   # Environment Overlays
│   │   ├── dev/                    # Development / Minikube: 1 replica per service, in-cluster infra enabled
│   │   ├── staging/                # Staging: 2 replicas, staging Ingress hostnames, PDBs enabled
│   │   └── production/             # Production: HA 3+ replicas, PgBouncer, HPA autoscaling, Ingress, PDBs
│   ├── k8s-start.ps1               # Automated dynamic deployment launcher (PowerShell)
│   ├── k8s-start.sh                # Automated dynamic deployment launcher (Bash)
│   └── kustomization.yaml          # Root Kustomize definition (defaults to overlays/dev)
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

## Centralized Configuration Architecture

The platform centralizes configuration across three distinct dimensions to eliminate duplication:

### 1. Centralized Maven Dependency Management (`pom.xml`)
- Single root aggregator manages all dependency versions via `<dependencyManagement>` and plugin lifecycles via `<pluginManagement>`.
- Version declarations are completely eliminated from child module POMs.
- Centralized libraries include:
  - **Spring Boot** `3.3.1` & **Spring Cloud** `2023.0.3`
  - **Spring AI** `1.0.0-M1`
  - **Testcontainers** `1.19.8`
  - **Razorpay SDK** `1.4.3` (`com.razorpay:razorpay-java`)
  - **JSON Tools** `20231013` (`org.json:json`)
  - **Structured Logging** `7.4` (`net.logstash.logback:logstash-logback-encoder`)
  - **Compiler**: Java 21 LTS with parameter metadata (`maven-compiler-plugin:3.13.0`)

### 2. Centralized Shared Spring Boot Properties (`config/common/`)
Shared microservice properties are modularized and versioned in `config/common/` (and packaged in `common-library/common-web` for classpath resolution):
- **`application-common.yml`**: Java 21 Virtual Threads (`threads.virtual.enabled: true`), graceful termination (`server.shutdown: graceful`), and Jackson non-null serialization.
- **`application-database.yml`**: PostgreSQL connection pooling (HikariCP 25 max, 10 min idle), Hibernate batching (`batch_size: 25`), and Flyway auto-migration.
- **`application-security.yml`**: JWT signing specifications and cross-origin resource sharing (CORS) standards.
- **`application-observability.yml`**: Actuator health probe enablement (`/actuator/health/liveness`, `/actuator/health/readiness`), Prometheus metrics percentiles, and Tempo OTLP trace export.
- **`application-kafka.yml`**: Kafka cluster connection coordinates, producer idempotency (`acks: all`), and consumer offset policies (`ack-mode: RECORD`).
- **`application-redis.yml`**: Redis coordinates, fast-fail connection timeouts (`100ms`), and Lettuce connection pooling.

Services import all shared standards with a single line in their local `application.yml`:
```yaml
spring:
  config:
    import: "optional:classpath:application-common.yml"
```
Each service defines only its unique overrides (port, schema name, consumer group, gateway routes).

### 3. Canonical Kubernetes Kustomize Hierarchy (`infrastructure/kubernetes/`)
- **`base/`**: Unifies all 9 Spring Boot microservices plus the React storefront into a single deployment topology. Every pod includes non-root security contexts (`UID 10001`), dual Actuator probes, resource limits, and internal ClusterIP services.
- **`components/`**: Modular capabilities that can be mixed and matched across environments:
  - `pgbouncer`: Connection pooler preventing Postgres thread starvation under high concurrent traffic.
  - `hpa`: Dynamic scaling driven by CPU (>75%) and memory (>80%) consumption.
  - `ingress`: NGINX ingress controller routing HTTPS traffic to `api.khandualoom.com` and `khandualoom.com`.
  - `pod-disruption-budget`: High-availability guarantees preventing node maintenance from draining critical services.
  - `in-cluster-infra`: Standalone databases and brokers for local development without external cloud dependencies.
- **`overlays/`**: Environment-specific resource allocations:
  - **`dev/`**: Single replica per pod, lower resource requests, in-cluster infrastructure enabled.
  - **`staging/`**: Dual replicas, staging ingress hostnames, PDBs enabled.
  - **`production/`**: HA 3+ replicas, PgBouncer, HPA autoscaling, production Ingress, PDBs enabled.

---

## Deployment Quickstart

### Option A: Local Backend Development (Backing Services Only)
```bash
# Starts Postgres, Redis, Kafka, Tempo, Prometheus, and Grafana:
docker compose -f infrastructure/docker/docker-compose.infra.yml up -d

# Initialize Kafka KRaft topics:
# PowerShell:
.\infrastructure\kafka\init-topics.ps1
# Bash:
./infrastructure\kafka\init-topics.sh
```

### Option B: Full Platform Stack via Docker Compose
```bash
docker compose up -d --build
```

### Option C: Kubernetes Orchestration
```powershell
# Deploy Development Overlay (Local Minikube / Kind):
.\infrastructure\kubernetes\k8s-start.ps1 -env dev

# Deploy Staging Overlay:
.\infrastructure\kubernetes\k8s-start.ps1 -env staging

# Deploy Production Overlay (EKS / GKE):
.\infrastructure\kubernetes\k8s-start.ps1 -env prod

# Check Live Status:
.\infrastructure\kubernetes\k8s-start.ps1 status

# Stop Deployments:
.\infrastructure\kubernetes\k8s-start.ps1 stop
```
Or directly using `kubectl`:
```bash
# Development:
kubectl apply -k infrastructure/kubernetes/overlays/dev

# Staging:
kubectl apply -k infrastructure/kubernetes/overlays/staging

# Production:
kubectl apply -k infrastructure/kubernetes/overlays/production
```
