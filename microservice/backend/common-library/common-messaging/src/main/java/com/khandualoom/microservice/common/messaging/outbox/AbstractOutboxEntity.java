package com.khandualoom.microservice.common.messaging.outbox;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.slf4j.MDC;

import java.time.Instant;
import java.util.UUID;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
public abstract class AbstractOutboxEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id = UUID.randomUUID();

    @Column(name = "aggregate_type", nullable = false, length = 64)
    private String aggregateType;

    @Column(name = "aggregate_id", nullable = false, length = 64)
    private String aggregateId;

    @Column(name = "event_type", nullable = false, length = 128)
    private String eventType;

    @Column(name = "event_version", nullable = false)
    private Integer eventVersion = 1;

    @Column(name = "payload", nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private OutboxStatus status = OutboxStatus.PENDING;

    @Column(name = "retry_count", nullable = false)
    private int retryCount = 0;

    @Column(name = "next_retry_at")
    private Instant nextRetryAt;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(name = "last_error", columnDefinition = "TEXT")
    private String lastError;

    @Column(name = "locked_by", length = 128)
    private String lockedBy;

    @Column(name = "locked_until")
    private Instant lockedUntil;

    @Column(name = "traceparent", length = 128)
    private String traceparent;

    @Column(name = "correlation_id", length = 128)
    private String correlationId;

    @Column(name = "causation_id", length = 128)
    private String causationId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public AbstractOutboxEntity(String aggregateType, String aggregateId, String eventType, String payload) {
        this.id = UUID.randomUUID();
        this.aggregateType = aggregateType;
        this.aggregateId = aggregateId;
        this.eventType = eventType;
        this.eventVersion = 1;
        this.payload = payload;
        this.status = OutboxStatus.PENDING;
        this.retryCount = 0;
        this.createdAt = Instant.now();

        // Capture distributed tracing context from MDC if active
        String corrId = MDC.get("correlationId");
        if (corrId == null) {
            corrId = MDC.get("X-Correlation-ID");
        }
        this.correlationId = corrId != null ? corrId : UUID.randomUUID().toString();

        String tp = MDC.get("traceparent");
        if (tp != null) {
            this.traceparent = tp;
        }
        String cause = MDC.get("causationId");
        if (cause != null) {
            this.causationId = cause;
        }
    }
}
