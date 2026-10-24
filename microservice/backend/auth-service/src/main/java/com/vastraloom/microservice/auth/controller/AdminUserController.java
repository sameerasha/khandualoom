package com.vastraloom.microservice.auth.controller;

import com.vastraloom.microservice.auth.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@SuppressWarnings("null")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;


    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(role);
                    userRepository.save(user);
                    return ResponseEntity.ok("User role updated successfully");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

