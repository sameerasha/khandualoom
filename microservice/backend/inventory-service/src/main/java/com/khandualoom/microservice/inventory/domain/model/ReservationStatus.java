package com.khandualoom.microservice.inventory.domain.model;

public enum ReservationStatus {
    PENDING,
    RESERVED,
    CONSUMED,
    RELEASED,
    EXPIRED;

    public boolean canTransitionTo(ReservationStatus next) {
        if (this == next) return true;
        return switch (this) {
            case PENDING -> next == RESERVED || next == RELEASED || next == EXPIRED;
            case RESERVED -> next == CONSUMED || next == RELEASED || next == EXPIRED;
            case CONSUMED, RELEASED, EXPIRED -> false; // Terminal states
        };
    }

    public boolean isTerminal() {
        return this == CONSUMED || this == RELEASED || this == EXPIRED;
    }
}
