package com.khandualoom.microservice.inventory.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockReservation {

    private UUID id;
    private Long orderId;
    private Long productId;
    private Integer quantity;
    private ReservationStatus status;
    private Instant expiresAt;
    private Instant createdAt;

    public static StockReservation create(Long orderId, Long productId, Integer quantity, long timeoutSeconds) {
        return StockReservation.builder()
                .id(UUID.randomUUID())
                .orderId(orderId)
                .productId(productId)
                .quantity(quantity)
                .status(ReservationStatus.RESERVED)
                .expiresAt(Instant.now().plusSeconds(timeoutSeconds))
                .createdAt(Instant.now())
                .build();
    }

    public void transitionTo(ReservationStatus nextStatus) {
        if (!this.status.canTransitionTo(nextStatus)) {
            throw new IllegalStateException("Invalid reservation state transition from " + this.status + " to " + nextStatus);
        }
        this.status = nextStatus;
    }

    public void markConsumed() {
        transitionTo(ReservationStatus.CONSUMED);
    }

    public void markReleased() {
        transitionTo(ReservationStatus.RELEASED);
    }

    public void markExpired() {
        transitionTo(ReservationStatus.EXPIRED);
    }
}
