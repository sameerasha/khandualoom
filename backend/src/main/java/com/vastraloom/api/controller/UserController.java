package com.vastraloom.api.controller;

import com.vastraloom.api.dto.ProfileUpdateRequest;
import com.vastraloom.api.dto.UserProfileResponse;
import com.vastraloom.api.model.User;
import com.vastraloom.api.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET /api/users/profile
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .map(user -> {
                    UserProfileResponse response = UserProfileResponse.builder()
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .phone(user.getPhone())
                            .addresses(user.getAddresses())
                            .build();
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/users/profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody ProfileUpdateRequest request) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentUsername));

        // 1. If username is changing, verify the new one is not already taken
        if (!user.getUsername().equals(request.getUsername())) {
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Error: Username is already taken!");
            }
            user.setUsername(request.getUsername());
        }

        // 2. Optional password update
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // 3. Update phone number
        user.setPhone(request.getPhone());

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
        }

        User updatedUser = userRepository.save(user);

        // Return updated profile details
        UserProfileResponse response = UserProfileResponse.builder()
                .username(updatedUser.getUsername())
                .email(updatedUser.getEmail())
                .phone(updatedUser.getPhone())
                .addresses(updatedUser.getAddresses())
                .build();

        return ResponseEntity.ok(response);
    }
}
