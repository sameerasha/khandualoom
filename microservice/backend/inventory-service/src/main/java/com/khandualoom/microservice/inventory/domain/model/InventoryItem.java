package com.khandualoom.microservice.inventory.domain.model;

import com.khandualoom.microservice.inventory.domain.exception.InsufficientStockException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {

    private Long id;
    private Long productId;
    private Integer availableStock;
    private Integer reservedStock;
    private Integer totalStock;
    private Integer reorderThreshold;
    private Long version;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

    public void reserveStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Reservation quantity must be strictly positive");
        }
        if (this.availableStock < quantity) {
            throw new InsufficientStockException(
                "Insufficient stock for product ID: " + productId + 
                ". Available: " + availableStock + ", requested: " + quantity
            );
        }
        this.availableStock -= quantity;
        this.reservedStock += quantity;
    }

    public void releaseStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Release quantity must be strictly positive");
        }
        int releaseQty = Math.min(this.reservedStock, quantity);
        this.reservedStock -= releaseQty;
        this.availableStock += releaseQty;
    }

    public void fulfillReservation(int quantity) {
        int fulfillQty = Math.min(this.reservedStock, quantity);
        this.reservedStock -= fulfillQty;
        this.totalStock -= fulfillQty;
    }

    public void adjustStock(int delta) {
        int newTotal = this.totalStock + delta;
        int newAvailable = this.availableStock + delta;
        if (newAvailable < 0 || newTotal < 0) {
            throw new InsufficientStockException("Adjustment would cause negative inventory");
        }
        this.totalStock = newTotal;
        this.availableStock = newAvailable;
    }
}
