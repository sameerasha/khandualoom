package com.khandualoom.microservice.user.presentation.controller;

import com.khandualoom.microservice.common.dto.ApiResponse;
import com.khandualoom.microservice.user.application.dto.*;
import com.khandualoom.microservice.user.application.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@Slf4j
@RequiredArgsConstructor
public class UserProfileController {

    private final UserService userService;

    @GetMapping({"/profile", "/me"})
    public ResponseEntity<?> getMyProfile(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            Principal principal
    ) {
        if (headerUserId != null) {
            return ResponseEntity.ok(userService.getProfileByUserId(headerUserId));
        }
        String email = headerEmail != null ? headerEmail : (principal != null ? principal.getName() : null);
        if (email != null) {
            return ResponseEntity.ok(userService.getProfileByEmail(email));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Unauthorized: User identity not found"));
    }

    @PutMapping({"/profile", "/me"})
    public ResponseEntity<?> updateMyProfile(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @Valid @RequestBody ProfileUpdateRequest request,
            Principal principal
    ) {
        Long userId = headerUserId;
        if (userId == null) {
            String email = headerEmail != null ? headerEmail : (principal != null ? principal.getName() : null);
            if (email != null) {
                UserProfileResponse existing = userService.getProfileByEmail(email);
                userId = existing.getUserId();
            }
        }
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: User identity not found"));
        }
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    @GetMapping("/addresses")
    public ResponseEntity<?> getMyAddresses(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail
    ) {
        Long userId = resolveUserId(headerUserId, headerEmail);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: User identity not found"));
        }
        return ResponseEntity.ok(userService.getUserAddresses(userId));
    }

    @PostMapping("/addresses")
    public ResponseEntity<?> addAddress(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @Valid @RequestBody AddressRequest request
    ) {
        Long userId = resolveUserId(headerUserId, headerEmail);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: User identity not found"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.addAddress(userId, request));
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<?> updateAddress(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request
    ) {
        Long userId = resolveUserId(headerUserId, headerEmail);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: User identity not found"));
        }
        return ResponseEntity.ok(userService.updateAddress(userId, id, request));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<?> deleteAddress(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @PathVariable Long id
    ) {
        Long userId = resolveUserId(headerUserId, headerEmail);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: User identity not found"));
        }
        userService.deleteAddress(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully"));
    }

    @PutMapping("/addresses/{id}/primary")
    public ResponseEntity<?> setPrimaryAddress(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @PathVariable Long id
    ) {
        Long userId = resolveUserId(headerUserId, headerEmail);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: User identity not found"));
        }
        return ResponseEntity.ok(userService.setPrimaryAddress(userId, id));
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestHeader(value = "X-User-Role", required = false) String role
    ) {
        if (!"ROLE_ADMIN".equalsIgnoreCase(role) && !"ROLE_SUPER_ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access Denied: Admin privileges required"));
        }
        return ResponseEntity.ok(userService.getAllProfiles());
    }

    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Role", required = false) String role
    ) {
        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(role) || "ROLE_SUPER_ADMIN".equalsIgnoreCase(role);
        if (!isAdmin && (headerUserId == null || !headerUserId.equals(id))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access Denied: You cannot view other users' profiles"));
        }
        return ResponseEntity.ok(userService.getProfileByUserId(id));
    }

    @PostMapping("/internal/sync")
    public ResponseEntity<?> syncUserProfile(
            @RequestBody Map<String, Object> payload
    ) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String email = (String) payload.get("email");
        String firstName = (String) payload.get("firstName");
        String lastName = (String) payload.get("lastName");
        String phone = (String) payload.get("phone");
        String role = (String) payload.get("role");

        userService.createOrUpdateProfile(userId, email, firstName, lastName, phone, role);
        return ResponseEntity.ok(Map.of("status", "synced", "userId", userId));
    }

    private Long resolveUserId(Long headerUserId, String headerEmail) {
        if (headerUserId != null) {
            return headerUserId;
        }
        if (headerEmail != null && !headerEmail.isBlank()) {
            try {
                return userService.getProfileByEmail(headerEmail).getUserId();
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
}
