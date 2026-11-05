package com.khandualoom.microservice.inventory.domain.model;

import com.khandualoom.microservice.inventory.domain.exception.InsufficientStockException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class InventoryItemTest {

    @Test
    @DisplayName("Should successfully reserve stock when available")
    void shouldReserveStockWhenAvailable() {
        InventoryItem item = InventoryItem.builder()
                .id(1L)
                .productId(101L)
                .availableStock(10)
                .reservedStock(2)
                .totalStock(12)
                .build();

        item.reserveStock(3);

        assertThat(item.getAvailableStock()).isEqualTo(7);
        assertThat(item.getReservedStock()).isEqualTo(5);
    }

    @Test
    @DisplayName("Should throw InsufficientStockException when reservation exceeds available stock")
    void shouldThrowWhenReservationExceedsAvailable() {
        InventoryItem item = InventoryItem.builder()
                .id(1L)
                .productId(102L)
                .availableStock(2)
                .reservedStock(0)
                .totalStock(2)
                .build();

        assertThatThrownBy(() -> item.reserveStock(5))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessageContaining("Insufficient stock for product ID: 102");
    }

    @Test
    @DisplayName("Should release stock and restore available quantity")
    void shouldReleaseStockAndRestoreAvailable() {
        InventoryItem item = InventoryItem.builder()
                .id(1L)
                .productId(103L)
                .availableStock(5)
                .reservedStock(5)
                .totalStock(10)
                .build();

        item.releaseStock(3);

        assertThat(item.getAvailableStock()).isEqualTo(8);
        assertThat(item.getReservedStock()).isEqualTo(2);
    }

    @Test
    @DisplayName("Should fulfill reservation and deduct total inventory")
    void shouldFulfillReservationAndDeductTotal() {
        InventoryItem item = InventoryItem.builder()
                .id(1L)
                .productId(104L)
                .availableStock(5)
                .reservedStock(5)
                .totalStock(10)
                .build();

        item.fulfillReservation(4);

        assertThat(item.getReservedStock()).isEqualTo(1);
        assertThat(item.getTotalStock()).isEqualTo(6);
        assertThat(item.getAvailableStock()).isEqualTo(5);
    }
}
