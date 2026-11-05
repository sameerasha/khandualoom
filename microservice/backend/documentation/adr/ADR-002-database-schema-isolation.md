# Architecture Decision Record (ADR-002)

## Title
ADR-002: Dedicated Database Schema Isolation per Microservice Bounded Context

## Status
Accepted

## Context
In microservices architecture, a shared database with cross-table foreign keys or joins tightly couples independent services, creating cascading deployment failures and blocking independent scaling. Conversely, managing 8 separate PostgreSQL server instances locally or in smaller development environments increases memory overhead.

## Decision
1. **Isolated PostgreSQL Schemas**:
   - Microservices share a single high-performance PostgreSQL 16 cluster, but operate under strictly isolated database schemas:
     - `auth_schema` (Auth Service)
     - `user_schema` (User Service)
     - `product_schema` (Product Catalog Service)
     - `inventory_schema` (Inventory Service)
     - `order_schema` (Order Service)
     - `payment_schema` (Payment Service)
     - `notification_schema` (Notification Service)
     - `audit_schema` (Audit Service)
2. **Zero Cross-Schema Joins**:
   - Microservices are strictly forbidden from issuing cross-schema SQL joins (e.g. `SELECT * FROM order_schema.orders o JOIN product_schema.products p`).
   - All inter-service data dependencies are satisfied via asynchronous Kafka events or REST API queries over Spring Cloud Gateway.
3. **Database Migration Ownership**:
   - Each microservice maintains its own Flyway migration scripts located in `src/main/resources/db/migration/` targeting its dedicated schema (`spring.flyway.schemas`).
   - The cluster initialization script (`infrastructure/postgres/init-schemas.sql`) sets up schemas and grants owner permissions upon first boot.

## Consequences
- **Positive**:
  - Independent schema evolution without lock conflicts.
  - Clear database boundaries preparing services for eventual physical database decomposition when scale requires.
  - Low operational overhead during development with single-container PostgreSQL deployment.
- **Trade-offs**:
  - Aggregated reporting across domains must be handled via event streaming (Kafka + Audit Service) or analytical read models rather than monolithic SQL queries.
