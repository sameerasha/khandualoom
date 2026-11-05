package com.khandualoom.microservice.inventory.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ReservationStatusTest {

    @Test
    @DisplayName("Should create stock reservation in RESERVED state")
    void shouldCreateReservationInReservedState() {
        StockReservation reservation = StockReservation.create(501L, 10L, 2, 900);

        assertThat(reservation.getId()).isNotNull();
        assertThat(reservation.getOrderId()).isEqualTo(501L);
        assertThat(reservation.getProductId()).isEqualTo(10L);
        assertThat(reservation.getQuantity()).isEqualTo(2);
        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.RESERVED);
        assertThat(reservation.getExpiresAt()).isAfter(reservation.getCreatedAt());
    }

    @Test
    @DisplayName("Should allow transition from RESERVED to CONSUMED upon order confirmation")
    void shouldAllowTransitionToConsumed() {
        StockReservation reservation = StockReservation.create(502L, 11L, 1, 900);
        reservation.markConsumed();

        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.CONSUMED);
        assertThat(reservation.getStatus().isTerminal()).isTrue();
    }

    @Test
    @DisplayName("Should allow transition from RESERVED to RELEASED upon cancellation")
    void shouldAllowTransitionToReleased() {
        StockReservation reservation = StockReservation.create(503L, 12L, 1, 900);
        reservation.markReleased();

        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.RELEASED);
        assertThat(reservation.getStatus().isTerminal()).isTrue();
    }

    @Test
    @DisplayName("Should allow transition from RESERVED to EXPIRED upon watchdog sweep")
    void shouldAllowTransitionToExpired() {
        StockReservation reservation = StockReservation.create(504L, 13L, 1, 900);
        reservation.markExpired();

        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.EXPIRED);
        assertThat(reservation.getStatus().isTerminal()).isTrue();
    }

    @Test
    @DisplayName("Terminal states should reject further transitions")
    void terminalStatesShouldRejectTransitions() {
        StockReservation reservation = StockReservation.create(505L, 14L, 1, 900);
        reservation.markConsumed();

        assertThatThrownBy(reservation::markReleased)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Invalid reservation state transition from CONSUMED to RELEASED");
    }
}
