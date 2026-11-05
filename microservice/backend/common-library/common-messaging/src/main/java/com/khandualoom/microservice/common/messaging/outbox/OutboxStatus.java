package com.khandualoom.microservice.common.messaging.outbox;

public enum OutboxStatus {
    PENDING,
    PUBLISHING,
    PUBLISHED,
    FAILED,
    DEAD_LETTER
}
