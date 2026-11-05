package com.khandualoom.microservice.auth.controller;

import com.khandualoom.microservice.auth.dto.ProfileUpdateRequest;
import com.khandualoom.microservice.auth.dto.UserProfileResponse;
import com.khandualoom.microservice.auth.model.User;
import com.khandualoom.microservice.auth.model.Address;
import com.khandualoom.microservice.auth.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.khandualoom.microservice.auth.service.OtpService;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/users")
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    /**
     * Get all users. Restricted to ADMIN and SUPER_ADMIN only.
     * Regular users receive 403 Forbidden.
     */
    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestHeader(value = "X-User-Role", required = false) String headerUserRole
    ) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : null;
        User currentUser = (currentEmail != null && !"anonymousUser".equals(currentEmail))
                ? userRepository.findByEmail(currentEmail).orElse(null)
                : null;
        String role = currentUser != null ? currentUser.getRole() : headerUserRole;

        if (!"ROLE_ADMIN".equalsIgnoreCase(role) && !"ROLE_SUPER_ADMIN".equalsIgnoreCase(role)) {
            log.warn("Access Denied: User {} attempted to list all users", currentEmail);
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body(Map.of("status", 403, "error", "Forbidden", "message", "Access Denied: Insufficient permissions to list all users."));
        }
        List<UserProfileResponse> responses = userRepository.findAll().stream()
                .map(u -> UserProfileResponse.builder()
                        .id(u.getId())
                        .firstName(u.getFirstName())
                        .lastName(u.getLastName())
                        .email(u.getEmail())
                        .phone(u.getPhone())
                        .emailVerified(u.isEmailVerified())
                        .phoneVerified(u.isPhoneVerified())
                        .addresses(u.getAddresses())
                        .build())
                .toList();
        return ResponseEntity.ok(responses);
    }

    /**
     * Get user details by ID.
     * Enforces ownership: A normal USER can ONLY access their own details.
     * Other users' details cannot be accessed (returns 403 Forbidden).
     * ADMIN and SUPER_ADMIN can access any user's details.
     */
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Role", required = false) String headerUserRole
    ) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : null;

        User currentUser = null;
        if (currentEmail != null && !"anonymousUser".equals(currentEmail)) {
            currentUser = userRepository.findByEmail(currentEmail).orElse(null);
        }

        Long authenticatedUserId = currentUser != null ? currentUser.getId() : headerUserId;
        String authenticatedRole = currentUser != null ? currentUser.getRole() : headerUserRole;

        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(authenticatedRole)
                || "ROLE_SUPER_ADMIN".equalsIgnoreCase(authenticatedRole);

        if (!isAdmin) {
            if (authenticatedUserId == null || !authenticatedUserId.equals(id)) {
                log.warn("IDOR violation attempt: Authenticated user {} tried to access details of user ID {}",
                        authenticatedUserId != null ? authenticatedUserId : currentEmail, id);
                return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                        .body(Map.of("status", 403, "error", "Forbidden", "message", "Access Denied: You cannot access other users' details."));
            }
        }

        return userRepository.findById(id)
                .map(user -> {
                    UserProfileResponse response = UserProfileResponse.builder()
                            .id(user.getId())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .email(user.getEmail())
                            .phone(user.getPhone())
                            .emailVerified(user.isEmailVerified())
                            .phoneVerified(user.isPhoneVerified())
                            .addresses(user.getAddresses())
                            .build();
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/users/profile
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(user -> {
                    UserProfileResponse response = UserProfileResponse.builder()
                            .id(user.getId())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .email(user.getEmail())
                            .phone(user.getPhone())
                            .emailVerified(user.isEmailVerified())
                            .phoneVerified(user.isPhoneVerified())
                            .addresses(user.getAddresses())
                            .build();
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/users/profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody ProfileUpdateRequest request) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentEmail));

        // Prevent Super Admin from changing credentials via profile API
        if ("ROLE_SUPER_ADMIN".equals(user.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Super Admin credentials can only be managed via environment variables."));
        }

        // 1. Update Name
        if (request.getFirstName() != null && !request.getFirstName().trim().isEmpty()) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().trim().isEmpty()) {
            user.setLastName(request.getLastName());
        }

        // 2. Optional password update
        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            if (request.getPreviousPassword() == null || !passwordEncoder.matches(request.getPreviousPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Incorrect previous password."));
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        // 3. Update phone number
        if (request.getPhone() != null && !request.getPhone().equals(user.getPhone())) {
            user.setPhone(request.getPhone());
            user.setPhoneVerified(false); // require re-verification if phone changes
        }

        // 4. Update/sync child Address collection
        user.getAddresses().clear();
        if (request.getAddresses() != null) {
            // Null out IDs of brand new addresses so Hibernate treats them as new records,
            // otherwise it might try to merge an ID that doesn't belong or is stale
            request.getAddresses().forEach(addr -> {
                if (addr.getId() != null && addr.getId() <= 0) {
                    addr.setId(null);
                }
            });
            user.getAddresses().addAll(request.getAddresses());

            // Normalize primary flag: exactly one address must be primary in the database
            boolean hasPrimary = false;
            for (Address addr : user.getAddresses()) {
                if (addr.isPrimary()) {
                    if (!hasPrimary) {
                        hasPrimary = true;
                    } else {
                        addr.setPrimary(false);
                    }
                }
            }
            if (!hasPrimary && !user.getAddresses().isEmpty()) {
                user.getAddresses().get(0).setPrimary(true);
            }
        }

        User updatedUser = userRepository.save(user);

        // Return updated profile details
        UserProfileResponse response = UserProfileResponse.builder()
                .id(updatedUser.getId())
                .firstName(updatedUser.getFirstName())
                .lastName(updatedUser.getLastName())
                .email(updatedUser.getEmail())
                .phone(updatedUser.getPhone())
                .emailVerified(updatedUser.isEmailVerified())
                .phoneVerified(updatedUser.isPhoneVerified())
                .addresses(updatedUser.getAddresses())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyProfileOtp(@RequestBody Map<String, String> request) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String identifier = request.get("identifier");
        String otp = request.get("otp");

        if (identifier == null || otp == null) {
            return ResponseEntity.badRequest().body("Identifier and OTP are required.");
        }

        // For normal verification, must belong to the user
        if (!identifier.equals(user.getEmail()) && !identifier.equals(user.getPhone())) {
            return ResponseEntity.badRequest().body("Identifier does not belong to the authenticated user.");
        }

        try {
            otpService.verifyOtp(identifier, otp);
            
            if (identifier.equals(user.getEmail())) {
                user.setEmailVerified(true);
            } else if (identifier.equals(user.getPhone())) {
                user.setPhoneVerified(true);
            }
            userRepository.save(user);

            return ResponseEntity.ok("Verification successful.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("OTP Verification failed: " + e.getMessage());
        }
    }

    @PutMapping("/profile/phone")
    public ResponseEntity<?> updatePhoneWithOtp(@RequestBody Map<String, String> payload) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String newPhone = payload.get("newPhone");
        String otp = payload.get("otp");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "error", "User not found"));
        }

        try {
            // Verify OTP that was sent to the NEW PHONE number
            otpService.verifyOtp(newPhone, otp);
            
            user.setPhone(newPhone);
            user.setPhoneVerified(true); // Directly mark as verified since we just verified it
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Phone number updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Invalid OTP"));
        }
    }

    // DELETE /api/users/profile
    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteUserProfile() {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete dependencies loosely coupled by userId

        // Delete the user (cascades to addresses)
        userRepository.delete(user);
        
        return ResponseEntity.ok(Map.of("success", true, "message", "Account successfully deleted."));
    }
}

