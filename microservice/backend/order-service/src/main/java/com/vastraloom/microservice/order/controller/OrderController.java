package com.vastraloom.microservice.order.controller;

import com.vastraloom.microservice.order.dto.OrderRequest;
import com.vastraloom.microservice.order.dto.OrderResponse;
import com.vastraloom.microservice.order.dto.OrderStatusUpdateRequest;
import com.vastraloom.microservice.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> createOrder(
            Principal principal,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestBody OrderRequest request
    ) {
        Long userId = headerUserId != null ? headerUserId : (principal != null ? 1L : null);
        if (principal != null && request.getCustomerEmail() == null) {
            request.setCustomerEmail(principal.getName());
        }
        return ResponseEntity.ok(orderService.createOrder(userId, request));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId
    ) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/admin/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody OrderStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }
}
