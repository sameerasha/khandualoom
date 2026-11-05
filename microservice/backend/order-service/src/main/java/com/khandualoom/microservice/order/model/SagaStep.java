package com.khandualoom.microservice.order.model;

public enum SagaStep {
    ORDER_CREATED,
    INVENTORY_RESERVATION,
    PAYMENT_PROCESSING,
    ORDER_CONFIRMED,
    COMPENSATION_TRIGGERED,
    CANCELLED
}
