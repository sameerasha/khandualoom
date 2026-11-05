package com.khandualoom.microservice.inventory.presentation.controller;

import com.khandualoom.microservice.common.dto.ApiResponse;
import com.khandualoom.microservice.inventory.application.dto.StockAdjustmentRequest;
import com.khandualoom.microservice.inventory.application.dto.StockCheckResponse;
import com.khandualoom.microservice.inventory.application.dto.StockReservationDto;
import com.khandualoom.microservice.inventory.application.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@Slf4j
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/{productId}")
    public ResponseEntity<StockCheckResponse> getStock(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.checkStock(productId));
    }

    @PostMapping("/batch-check")
    public ResponseEntity<List<StockCheckResponse>> batchCheckStock(@RequestBody List<Long> productIds) {
        return ResponseEntity.ok(inventoryService.checkStockBatch(productIds));
    }

    @PostMapping("/reserve")
    public ResponseEntity<StockReservationDto> reserveStock(@RequestBody Map<String, Object> request) {
        Long orderId = Long.valueOf(request.get("orderId").toString());
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        return ResponseEntity.ok(inventoryService.reserveStock(orderId, productId, quantity));
    }

    @PostMapping("/release/{orderId}")
    public ResponseEntity<ApiResponse<Void>> releaseStock(@PathVariable Long orderId) {
        inventoryService.releaseReservation(orderId);
        return ResponseEntity.ok(ApiResponse.success("Stock reservation released for order: " + orderId));
    }

    @PostMapping("/fulfill/{orderId}")
    public ResponseEntity<ApiResponse<Void>> fulfillStock(@PathVariable Long orderId) {
        inventoryService.fulfillReservation(orderId);
        return ResponseEntity.ok(ApiResponse.success("Stock fulfilled for order: " + orderId));
    }

    @PostMapping("/adjust")
    public ResponseEntity<StockCheckResponse> adjustStock(@Valid @RequestBody StockAdjustmentRequest request) {
        return ResponseEntity.ok(inventoryService.adjustStock(request));
    }
}
