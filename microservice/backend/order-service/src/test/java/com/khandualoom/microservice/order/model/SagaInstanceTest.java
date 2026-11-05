package com.khandualoom.microservice.order.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SagaInstanceTest {

    @Test
    @DisplayName("Should initialize Saga in STARTED state at ORDER_CREATED step")
    void shouldInitializeSagaCorrectly() {
        SagaInstance saga = SagaInstance.start(1001L, 900);

        assertThat(saga.getSagaId()).isNotNull();
        assertThat(saga.getOrderId()).isEqualTo(1001L);
        assertThat(saga.getCurrentStep()).isEqualTo(SagaStep.ORDER_CREATED);
        assertThat(saga.getSagaStatus()).isEqualTo(SagaStatus.STARTED);
        assertThat(saga.getDeadlineAt()).isAfter(saga.getStepStartedAt());
        assertThat(saga.getCompensationStatus()).isEqualTo("NONE");
    }

    @Test
    @DisplayName("Should advance Saga step to PAYMENT_PROCESSING with updated deadline")
    void shouldAdvanceStepToPaymentProcessing() {
        SagaInstance saga = SagaInstance.start(1002L, 900);
        saga.transitionTo(SagaStep.PAYMENT_PROCESSING, SagaStatus.IN_PROGRESS, 600);

        assertThat(saga.getCurrentStep()).isEqualTo(SagaStep.PAYMENT_PROCESSING);
        assertThat(saga.getSagaStatus()).isEqualTo(SagaStatus.IN_PROGRESS);
    }

    @Test
    @DisplayName("Should mark Saga as SUCCEEDED upon order confirmation")
    void shouldMarkSagaAsSucceeded() {
        SagaInstance saga = SagaInstance.start(1003L, 900);
        saga.markSucceeded();

        assertThat(saga.getCurrentStep()).isEqualTo(SagaStep.ORDER_CONFIRMED);
        assertThat(saga.getSagaStatus()).isEqualTo(SagaStatus.SUCCEEDED);
    }

    @Test
    @DisplayName("Should trigger and track compensation workflow upon payment failure")
    void shouldTriggerAndTrackCompensation() {
        SagaInstance saga = SagaInstance.start(1004L, 900);
        saga.triggerCompensation("Card declined");

        assertThat(saga.getCurrentStep()).isEqualTo(SagaStep.COMPENSATION_TRIGGERED);
        assertThat(saga.getSagaStatus()).isEqualTo(SagaStatus.COMPENSATING);
        assertThat(saga.getCompensationStatus()).isEqualTo("IN_PROGRESS");
        assertThat(saga.getLastError()).isEqualTo("Card declined");

        saga.markCompensated();
        assertThat(saga.getCurrentStep()).isEqualTo(SagaStep.CANCELLED);
        assertThat(saga.getSagaStatus()).isEqualTo(SagaStatus.COMPENSATED);
        assertThat(saga.getCompensationStatus()).isEqualTo("COMPLETED");
    }
}
