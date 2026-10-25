package com.khandualoom.microservice.auth.controller;

import com.khandualoom.microservice.auth.model.AuthProvider;
import com.khandualoom.microservice.auth.model.User;
import com.khandualoom.microservice.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/super-admin/admins")
@RequiredArgsConstructor
public class SuperAdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // GET /api/super-admin/admins
    @GetMapping
    public ResponseEntity<?> getAllAdmins() {
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> "ROLE_ADMIN".equals(u.getRole()) || "ROLE_SUPER_ADMIN".equals(u.getRole()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(admins);
    }

    // POST /api/super-admin/admins
    @PostMapping
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, String> payload) {
        String firstName = payload.get("firstName");
        String lastName = payload.get("lastName");
        String email = payload.get("email");
        String password = payload.get("password");
        String role = payload.getOrDefault("role", "ROLE_ADMIN");
        if (!"ROLE_SUPER_ADMIN".equals(role)) {
            role = "ROLE_ADMIN";
        }

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and Password are required"));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already in use"));
        }

        User newAdmin = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .provider(AuthProvider.local)
                .emailVerified(true)
                .phoneVerified(true)
                .build();

        userRepository.save(newAdmin);
        return ResponseEntity.ok(Map.of("message", "Admin created successfully"));
    }

    // PUT /api/super-admin/admins/{id}/password
    @PutMapping("/{id}/password")
    public ResponseEntity<?> changeAdminPassword(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newPassword = payload.get("newPassword");
        
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "New password is required"));
        }

        return userRepository.findById(id).map(user -> {
            if (!"ROLE_ADMIN".equals(user.getRole())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Can only change password for ROLE_ADMIN users"));
            }
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Admin password changed successfully"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
    // PUT /api/super-admin/admins/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String firstName = payload.get("firstName");
        String lastName = payload.get("lastName");
        String email = payload.get("email");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        return userRepository.findById(id).map(user -> {
            if (!"ROLE_ADMIN".equals(user.getRole())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Can only update ROLE_ADMIN users"));
            }
            
            // Check if new email is already taken by another user
            if (!email.equals(user.getEmail())) {
                if (userRepository.findByEmail(email).isPresent()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Email is already in use by another account"));
                }
            }

            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Admin updated successfully"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}

