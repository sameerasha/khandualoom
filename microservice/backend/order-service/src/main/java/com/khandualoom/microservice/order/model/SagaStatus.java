package com.khandualoom.microservice.order.model;

public enum SagaStatus {
    STARTED,
    IN_PROGRESS,
    SUCCEEDED,
    COMPENSATING,
    COMPENSATED,
    FAILED
}
