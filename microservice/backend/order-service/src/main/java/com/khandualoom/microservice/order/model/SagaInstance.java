package com.khandualoom.microservice.order.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "saga_instances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SagaInstance {

    @Id
    @Column(name = "saga_id", nullable = false)
    private UUID sagaId;

    @Column(name = "order_id", nullable = false, unique = true)
    private Long orderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_step", nullable = false, length = 32)
    private SagaStep currentStep;

    @Enumerated(EnumType.STRING)
    @Column(name = "saga_status", nullable = false, length = 32)
    private SagaStatus sagaStatus;

    @Column(name = "step_started_at", nullable = false)
    private Instant stepStartedAt;

    @Column(name = "deadline_at", nullable = false)
    private Instant deadlineAt;

    @Column(name = "retry_count", nullable = false)
    private int retryCount;

    @Column(name = "last_error")
    private String lastError;

    @Column(name = "next_retry_at")
    private Instant nextRetryAt;

    @Column(name = "compensation_status", length = 32)
    private String compensationStatus;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public static SagaInstance start(Long orderId, long timeoutSeconds) {
        Instant now = Instant.now();
        return SagaInstance.builder()
                .sagaId(UUID.randomUUID())
                .orderId(orderId)
                .currentStep(SagaStep.ORDER_CREATED)
                .sagaStatus(SagaStatus.STARTED)
                .stepStartedAt(now)
                .deadlineAt(now.plusSeconds(timeoutSeconds))
                .retryCount(0)
                .compensationStatus("NONE")
                .version(0L)
                .build();
    }

    public void transitionTo(SagaStep step, SagaStatus status, long nextTimeoutSeconds) {
        this.currentStep = step;
        this.sagaStatus = status;
        this.stepStartedAt = Instant.now();
        this.deadlineAt = Instant.now().plusSeconds(nextTimeoutSeconds);
    }

    public void markSucceeded() {
        this.currentStep = SagaStep.ORDER_CONFIRMED;
        this.sagaStatus = SagaStatus.SUCCEEDED;
    }

    public void triggerCompensation(String reason) {
        this.currentStep = SagaStep.COMPENSATION_TRIGGERED;
        this.sagaStatus = SagaStatus.COMPENSATING;
        this.lastError = reason;
        this.compensationStatus = "IN_PROGRESS";
    }

    public void markCompensated() {
        this.currentStep = SagaStep.CANCELLED;
        this.sagaStatus = SagaStatus.COMPENSATED;
        this.compensationStatus = "COMPLETED";
    }
}
