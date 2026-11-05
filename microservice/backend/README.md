# Khandua Looms — Distributed Enterprise Microservices Platform

Welcome to the backend engineering repository for **Khandua Looms**, an authentic Odisha Handloom luxury commerce platform.

This platform has been architected and upgraded according to **Domain-Driven Design (DDD)**, **Hexagonal Architecture (Ports and Adapters)**, **Clean Architecture**, **Event-Driven Architecture (EDA)**, **Saga Pattern**, **Transactional Outbox**, and **Cloud-Native distributed design patterns**.

---

## 1. System Overview

### Core Microservices (9 Dedicated Services)
| Service | Port | Bounded Context | Architecture | Database Schema |
| :--- | :--- | :--- | :--- | :--- |
| **`api-gateway`** | `8080` (Host `8090`) | Edge Routing & Security | Spring Cloud Gateway (Reactive Netty) | None (Stateless) |
| **`auth-service`** | `8081` | Identity & Access Control | Hexagonal / Clean Architecture | `auth_schema` |
| **`user-service`** | `8086` | User Profile & Address Book | Hexagonal / Clean Architecture | `user_schema` |
| **`product-service`** | `8082` | Catalog & Vector AI Search | Hexagonal / Clean Architecture | `product_schema` |
| **`inventory-service`** | `8087` | Stock & Reservation Locks | Hexagonal / Clean Architecture | `inventory_schema` |
| **`order-service`** | `8083` | Order & Saga Orchestrator | Hexagonal / Clean Architecture | `order_schema` |
| **`payment-service`** | `8088` | Razorpay Payments & Webhooks | Hexagonal / Clean Architecture | `payment_schema` |
| **`notification-service`**| `8084` | Brevo SMTP Transactional Mail | Hexagonal / Clean Architecture | `notification_schema` |
| **`audit-service`** | `8089` | Platform Event Audit Trail | Hexagonal / Clean Architecture | `audit_schema` |

---

## 2. Multi-Module Project Structure

```
backend/
├── pom.xml                               # Root Aggregator POM (20 modules)
├── common-library/                       # Reusable Technical Foundation
│   ├── common-web/                       # RFC 7807, Correlation ID Filter, ApiResponses
│   ├── common-security/                  # JWT Utilities, SHA-256 Token Hashers
│   ├── common-observability/             # Logstash JSON Encoder, OpenTelemetry, Prometheus
│   ├── common-messaging/                 # Transactional Outbox, Consumer Idempotency
│   └── common-test/                      # Testcontainers for PostgreSQL 16 & Kafka
├── contracts/                            # Decoupled Evolution Contracts
│   ├── event-contracts/                  # Versioned Domain Integration Events
│   ├── api-contracts/                    # Inter-Service Transfer DTOs
│   └── schema-registry/                  # Schema Versioning & Verification
├── api-gateway/                          # Reactive API Gateway & Rate Limiter
├── auth-service/                         # Identity Bounded Context
├── user-service/                         # Customer Bounded Context
├── product-service/                      # Catalog & Semantic Search Context
├── inventory-service/                    # Real-time Stock Reservation Context
├── order-service/                        # Saga Orchestrator & Orders Context
├── payment-service/                      # Razorpay Gateway Context
├── notification-service/                 # Email Notification Context
├── audit-service/                        # Immutable Event Audit Context
├── infrastructure/                       # Infrastructure-as-Code
│   ├── docker/                           # Production multi-stage Dockerfiles
│   ├── kafka/                            # KRaft Kafka topic provisioning
│   ├── postgres/                         # Multi-schema init (init-schemas.sql)
│   ├── redis/                            # Redis eviction & caching policies
│   ├── prometheus/                       # Metrics scrape configurations
│   ├── tempo/                            # Distributed tracing pipelines
│   └── kubernetes/                       # K8s Deployments, ConfigMaps, Services
├── documentation/                        # Engineering Specifications
│   ├── architecture/                     # System architecture & Mermaid flowcharts
│   ├── adr/                              # Architecture Decision Records
│   ├── events/                           # Kafka event catalogs & schemas
│   ├── database/                         # Schema designs & pgvector setup
│   └── api/                              # Edge Gateway routing matrix & RFC 7807 specs
├── docker-compose.yml                    # Unified orchestration of 17 services
└── README.md                             # This guide
```

---

## 3. Quick Start

### Prerequisites
- **JDK 21** (Eclipse Temurin recommended)
- **Maven 3.9+** (or bundled `mvnw.cmd`)
- **Docker & Docker Compose v2+**

### Building the Modules
To clean and compile all 20 modules without running tests:
```powershell
.\mvnw.cmd clean package -DskipTests
```

### Launching Infrastructure and Microservices
Using the automated PowerShell runner:
```powershell
# Start all containers in development mode
.\docker-start.ps1 -env dev

# Check container status
.\docker-start.ps1 status

# Stop containers
.\docker-start.ps1 stop
```

Or using native Docker Compose:
```bash
docker compose --env-file .env.dev up -d
```

---

## 4. Observability & Monitoring Dashboards

| Tool | Port | URL | Credentials |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `8090` | `http://localhost:8090` | Public / Token Relay |
| **Kafka UI** | `8085` | `http://localhost:8085` | None |
| **Prometheus** | `9090` | `http://localhost:9090` | None |
| **Grafana Tempo** | `3200` | `http://localhost:3200` | None |
| **Grafana Dashboards** | `3001` | `http://localhost:3001` | `admin` / `admin` |

---

## 5. Architectural Invariants

1. **No Direct Cross-Service DB Access**: All services strictly access their dedicated PostgreSQL schema. Cross-schema joins are eliminated.
2. **Domain Layer Purity**: The `domain/` package in each microservice contains zero references to Spring framework, Kafka, or ORM/JPA annotations.
3. **Idempotent Consumers**: Every Kafka consumer validates incoming `eventId` against the `processed_events` table before applying state updates.
4. **Saga Compensations**: When prepaid checkout payment fails, the Saga orchestrator automatically emits `inventory.release-reservation` to restore locked items.
