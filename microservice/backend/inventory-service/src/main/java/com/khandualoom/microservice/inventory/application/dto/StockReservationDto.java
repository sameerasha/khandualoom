package com.khandualoom.microservice.inventory.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockReservationDto {
    private UUID reservationId;
    private Long orderId;
    private Long productId;
    private Integer quantity;
    private String status;
}
