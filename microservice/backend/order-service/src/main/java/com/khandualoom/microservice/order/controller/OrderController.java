package com.khandualoom.microservice.order.controller;

import com.khandualoom.microservice.order.dto.OrderRequest;
import com.khandualoom.microservice.order.dto.OrderResponse;
import com.khandualoom.microservice.order.dto.OrderStatusUpdateRequest;
import com.khandualoom.microservice.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/orders", "/api/checkout"})
@Slf4j
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping({"", "/checkout"})
    public ResponseEntity<OrderResponse> createOrder(
            Principal principal,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerUserEmail,
            @RequestBody OrderRequest request
    ) {
        Long userId = headerUserId != null ? headerUserId : (principal != null ? 1L : null);
        if (headerUserEmail != null && (request.getCustomerEmail() == null || request.getCustomerEmail().isBlank())) {
            request.setCustomerEmail(headerUserEmail);
        } else if (principal != null && (request.getCustomerEmail() == null || request.getCustomerEmail().isBlank())) {
            request.setCustomerEmail(principal.getName());
        }
        return ResponseEntity.ok(orderService.createOrder(userId, request));
    }

    /**
     * Get orders for the authenticated user.
     * Non-admin users can ONLY retrieve their own orders.
     */
    @GetMapping({"", "/my-orders"})
    public ResponseEntity<?> getOrders(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Role", required = false) String headerUserRole,
            @RequestHeader(value = "X-User-Email", required = false) String headerUserEmail,
            Principal principal
    ) {
        String role = headerUserRole != null ? headerUserRole : "";
        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(role) || "ROLE_SUPER_ADMIN".equalsIgnoreCase(role);

        // Admins can see all orders if not scoped to a user
        if (isAdmin && headerUserId == null) {
            return ResponseEntity.ok(orderService.getAllOrders());
        }

        Long userId = headerUserId != null ? headerUserId : (principal != null ? 1L : null);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", 401, "error", "Unauthorized", "message", "User identity not found in request."));
        }

        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    /**
     * Get a specific order by ID.
     * Enforces ownership: ROLE_USER can only view their own order.
     * Attempting to access another user's order yields 403 Forbidden.
     */
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Role", required = false) String headerUserRole,
            @RequestHeader(value = "X-User-Email", required = false) String headerUserEmail
    ) {
        OrderResponse order = orderService.getOrderById(id);
        String role = headerUserRole != null ? headerUserRole : "";
        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(role) || "ROLE_SUPER_ADMIN".equalsIgnoreCase(role);

        if (!isAdmin) {
            boolean matchesUserId = headerUserId != null && headerUserId.equals(order.getUserId());
            boolean matchesEmail = headerUserEmail != null && headerUserEmail.equalsIgnoreCase(order.getCustomerEmail());

            if (!matchesUserId && !matchesEmail) {
                log.warn("IDOR violation attempt: User {} attempted to view Order #{} belonging to User {}",
                        headerUserId != null ? headerUserId : headerUserEmail, id, order.getUserId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("status", 403, "error", "Forbidden", "message", "Access Denied: You can only view your own orders."));
            }
        }

        return ResponseEntity.ok(order);
    }

    /**
     * Admin-only endpoint to view all system orders.
     */
    @GetMapping({"/admin/all", "/all"})
    public ResponseEntity<?> getAllOrders(
            @RequestHeader(value = "X-User-Role", required = false) String headerUserRole
    ) {
        String role = headerUserRole != null ? headerUserRole : "";
        if (!"ROLE_ADMIN".equalsIgnoreCase(role) && !"ROLE_SUPER_ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("status", 403, "error", "Forbidden", "message", "Access Denied: Only ADMIN or SUPER_ADMIN can view all orders."));
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * Admin-only endpoint to update order status.
     */
    @PutMapping({"/{id}/status", "/admin/{id}/status"})
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String headerUserRole,
            @RequestBody OrderStatusUpdateRequest request
    ) {
        String role = headerUserRole != null ? headerUserRole : "";
        if (!"ROLE_ADMIN".equalsIgnoreCase(role) && !"ROLE_SUPER_ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("status", 403, "error", "Forbidden", "message", "Access Denied: Only ADMIN or SUPER_ADMIN can update order status."));
        }
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }
}
