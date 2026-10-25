package com.khandualoom.microservice.auth.security;

import com.khandualoom.microservice.auth.model.User;
import com.khandualoom.microservice.auth.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;

import lombok.RequiredArgsConstructor;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        log.debug("Attempting to load user by identifier: {}", identifier);

        String clean = identifier != null ? identifier.trim() : "";
        String normalized = normalizeEmail(clean);

        // 1. Try exact email or phone match
        Optional<User> userOpt = userRepository.findByEmail(clean)
                .or(() -> userRepository.findByPhone(clean));

        // 2. Try normalized email if different from raw
        if (userOpt.isEmpty() && !clean.equalsIgnoreCase(normalized)) {
            userOpt = userRepository.findByEmail(normalized);
        }

        // 3. Fallback: case-insensitive match across all users
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findAll().stream()
                    .filter(u -> u.getEmail().equalsIgnoreCase(clean)
                            || u.getEmail().equalsIgnoreCase(normalized)
                            || (u.getPhone() != null && u.getPhone().equals(clean)))
                    .findFirst();
        }

        User user = userOpt.orElseThrow(() -> {
            log.error("User not found with identifier: {} (normalized: {})", identifier, normalized);
            return new UsernameNotFoundException("User not found with identifier: " + identifier);
        });

        log.debug("User {} loaded successfully with role {}", user.getEmail(), user.getRole());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword() != null ? user.getPassword() : "",
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }

    private String normalizeEmail(String email) {
        if (email == null) return "";
        String lower = email.trim().toLowerCase();
        if (lower.startsWith("admin@") || lower.startsWith("superadmin@") || lower.startsWith("user@") || lower.startsWith("customer@")) {
            int atIndex = lower.indexOf('@');
            String domain = lower.substring(atIndex + 1);
            if (domain.contains("khandua") || domain.contains("khadua") || domain.contains("vastra")) {
                return lower.substring(0, atIndex + 1) + "khandualoom.com";
            }
        }
        return lower;
    }
}

