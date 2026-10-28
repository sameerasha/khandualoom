---
name: spring-boot-java
description: Standards, coding conventions, and architectural best practices for Java 21 and Spring Boot 3.3.x microservices. Covers Clean Architecture, SOLID principles, REST APIs, DTO mapping with MapStruct, Lombok best practices, constructor injection, Jakarta Bean Validation, global exception handling via ProblemDetail (RFC 7807), declarative transactions, API versioning, OpenAPI documentation, and high-throughput virtual threads. Use this skill when developing, refactoring, or code-reviewing Java backend microservices.
---

# Spring Boot & Java 21 Engineering Skill

## 1. Role and Scope
Act as a Lead Java 21 & Spring Boot Backend Engineer. This skill governs the development of robust, maintainable, and high-performance microservices adhering to Clean Architecture and modern Java language standards.

### Scope Boundaries:
- **In Scope**: Java 21 language features (records, sealed interfaces, virtual threads), Spring Boot 3.3.x starter composition, Spring MVC REST controllers, MapStruct DTO mappings, Jakarta Validation, Spring Data JPA repositories, `@Transactional` boundaries, OpenAPI generation, and structured logging.
- **Out of Scope**: Distributed architecture design (refer to `microservices-architect`), LLM/RAG integrations (refer to `spring-ai-rag`), deep Kafka consumer configurations (refer to `kafka-event-driven`), and containerization (refer to `docker-kubernetes`).

---

## 2. Technology Standards
- **Runtime**: Java 21 LTS (Oracle OpenJDK or Eclipse Temurin)
- **Framework**: Spring Boot 3.3.x
- **Build Tool**: Apache Maven 3.9+ with standardized multi-module or independent POMs
- **Object Mapping**: MapStruct 1.5.x (compile-time annotation processor; zero reflection overhead)
- **Boilerplate Reduction**: Project Lombok (restricted to `@Getter`, `@Setter`, `@Slf4j`, `@Builder`; avoid `@Data` on JPA entities)
- **Validation**: Jakarta Bean Validation (`spring-boot-starter-validation`)
- **API Documentation**: SpringDoc OpenAPI 2.5.x (Swagger UI with OpenAPI 3.1)
- **Concurrency**: Java 21 Virtual Threads (`spring.threads.virtual.enabled=true`)

---

## 3. Architecture and Implementation Rules

### 3.1 Clean Architecture & Package by Feature
Maintain clear layer boundaries:
```text
com.khandualoom.service.[feature]
├── api/
│   ├── dto/             # Request & Response Java Records
│   ├── mapper/          # MapStruct Mapper interfaces
│   └── [Feature]Controller.java
├── domain/
│   ├── model/           # JPA Entities & Value Objects
│   └── repository/      # Spring Data JPA Repository interfaces
├── service/
│   ├── [Feature]Service.java          # Public business contract
│   └── impl/[Feature]ServiceImpl.java # Concrete domain orchestration
└── exception/           # Feature-specific domain exceptions
```

### 3.2 Constructor Injection & Immutability
- **Strict Constructor Injection**: Field injection (`@Autowired` on private fields) is strictly forbidden. Use constructor injection with `final` fields, either explicitly or via Lombok `@RequiredArgsConstructor`.
- **Immutable DTOs with Java Records**: All request bodies, response payloads, and internal command messages must be declared as immutable Java `record` types.

### 3.3 Safe JPA Entity Standards
- **Never use Lombok `@Data` or `@EqualsAndHashCode` on `@Entity`**: It breaks Hibernate proxy equality and causes hash collision issues in sets. Implement `equals()` and `hashCode()` based strictly on business keys or immutable UUIDs.
- **Fetch Strategy**: Default all `@OneToMany`, `@ManyToMany`, and `@ManyToOne` relationships to `FetchType.LAZY` to prevent N+1 query disasters.

---

## 4. Step-by-Step Workflow

1. **Dependency Verification**:
   - Check `pom.xml` for Java 21 compiler properties:
     ```xml
     <properties>
         <java.version>21</java.version>
         <maven.compiler.source>21</maven.compiler.source>
         <maven.compiler.target>21</maven.compiler.target>
     </properties>
     ```
2. **DTO & Validation Definition**:
   - Define immutable Java 21 record request/response models with Jakarta validation annotations (`@NotBlank`, `@Size`, `@Positive`).
3. **MapStruct Mapper Generation**:
   - Create interface annotated with `@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)`.
4. **Service & Transaction Modeling**:
   - Implement business logic with `@Transactional(readOnly = true)` at class level and `@Transactional` on mutating methods.
5. **Controller & Error Handling**:
   - Expose versioned REST endpoints (`/api/v1/...`). Handle errors using `ResponseEntityExceptionHandler` returning `ProblemDetail`.
6. **OpenAPI Documentation**:
   - Annotate controllers with `@Tag` and endpoints with `@Operation` and `@ApiResponse`.

---

## 5. Coding and Configuration Standards

### 5.1 Virtual Threads Enablement (`application.yml`)
```yaml
spring:
  application:
    name: order-service
  threads:
    virtual:
      enabled: true
  jackson:
    serialization:
      write-dates-as-timestamps: false
    default-property-inclusion: non_null
```

### 5.2 Java 21 Record DTO with Validation
```java
package com.khandualoom.service.order.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

public record CreateOrderRequest(
    @NotNull(message = "Customer ID is required")
    UUID customerId,

    @NotBlank(message = "Item SKU must not be blank")
    String sku,

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than zero")
    Integer quantity,

    @NotNull(message = "Unit price is required")
    @Positive(message = "Unit price must be positive")
    BigDecimal unitPrice
) {}
```

### 5.3 Global Exception Handling with RFC 7807 (`ProblemDetail`)
```java
package com.khandualoom.service.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.net.URI;
import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Resource Not Found");
        problem.setType(URI.create("https://khandualoom.com/errors/not-found"));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
            .map(err -> err.getField() + ": " + err.getDefaultMessage())
            .collect(Collectors.joining("; "));
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, errors);
        problem.setTitle("Validation Failed");
        problem.setType(URI.create("https://khandualoom.com/errors/validation-failed"));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }
}
```

---

## 6. Security Requirements
- **Sanitize Inputs**: Strip control characters and HTML from user input to eliminate XSS/Injection attacks.
- **Never Expose Internal Entities**: Entity models must never be returned directly in REST responses; always map through clean DTOs.
- **Log Masking**: Mask personally identifiable information (PII) like customer names, emails, card numbers, or mobile numbers in SLF4J logs.

---

## 7. Testing and Validation Requirements
- **Unit Testing**: JUnit 5 with Mockito (`@ExtendWith(MockitoExtension.class)`).
- **Web Layer Slice Testing**: `@WebMvcTest` with `MockMvc` for controller validation and status code verification.
- **Coverage Standard**: Enforce 80%+ branch and line coverage via JaCoCo (refer to `testing-code-quality`).

---

## 8. Expected Deliverables
1. **Production-Ready Spring Boot Artifact**: Maven project compiling with zero warnings under `-Xlint:all`.
2. **DTO & Mapper Suite**: Complete Java records with MapStruct compile-time mappers.
3. **OpenAPI Specification**: Accessible via `/swagger-ui/index.html` and `/v3/api-docs`.
4. **Clean Domain Services**: Layered with strict separation of concerns and comprehensive validation.

---

## 9. Common Mistakes to Avoid
- **Entity Leakage**: Returning Hibernate entities directly from `@RestController` methods, causing LazyInitializationExceptions and exposing internal DB column schemas.
- **Missing `@Transactional` Boundary**: Forgetting that Spring's default `@Transactional` only rolls back on unchecked (`RuntimeException`), not checked exceptions (always use `@Transactional(rollbackFor = Exception.class)`).
- **Blocking inside Reactive / Event Loops**: Mixing synchronous blocking I/O into reactive streams without using offloaded thread schedulers.
- **Ignoring Spring Profiles**: Hardcoding configuration values instead of externalizing through `application.yml` and environment variables.
