# Architecture Decision Record (ADR-001)

## Title
ADR-001: Adoption of Hexagonal Architecture (Ports & Adapters) and Domain-Driven Design (DDD)

## Status
Accepted

## Context
The Khandua Looms platform was previously structured around standard layered Spring Boot modules where business logic, web controllers, Spring annotations, and JPA/Hibernate entities were tightly coupled. Changes to database schemas or external notification vendors leaked directly into business rules. Furthermore, domain invariants like stock reservation timeouts, payment verification hashes, and order confirmation constraints were scattered across services.

## Decision
1. **Domain-Driven Design (DDD)**:
   - Identify explicit Bounded Contexts: *Identity/Access*, *User Profile*, *Product Catalog*, *Inventory*, *Order Management*, *Payment*, *Notification*, and *Audit*.
   - Encapsulate all business validation and state transitions inside Domain Aggregate Roots and Entities.
   - Forbid cross-service entity references; services reference foreign aggregates exclusively by ID or through asynchronous Integration Events.

2. **Hexagonal Architecture (Ports & Adapters)**:
   - Every microservice divides its internal structure into `domain`, `application`, `infrastructure`, and `presentation`.
   - The `domain` layer has zero framework dependencies (pure Java 21 POJOs).
   - Use-cases and orchestrators interact with persistence, event publishers, and third-party APIs exclusively via Application Output Ports.
   - Spring `@RestController` endpoints act purely as Driving Adapters translating HTTP requests into Input Port commands.
   - JPA entities and repositories reside strictly in the `infrastructure/persistence` layer as Driven Adapters.

## Consequences
- **Positive**:
  - High testability: domain logic is tested using fast, framework-free unit tests without Spring context or mock beans.
  - Technology resilience: underlying databases, message brokers, or external APIs can be upgraded or replaced without modifying core business rules.
  - Clear separation of concerns and team scalability.
- **Trade-offs**:
  - Slight boilerplate due to mapping between domain models, JPA entities, and API DTOs.
  - Developers must maintain discipline not to leak Spring/JPA annotations into the domain model.
