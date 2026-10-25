package com.khandualoom.microservice.auth.config;

import com.khandualoom.microservice.auth.model.AuthProvider;
import com.khandualoom.microservice.auth.model.User;
import com.khandualoom.microservice.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${khandualoom.superadmin.email:${khandualoom.superadmin.email:${khandualoom.superadmin.email:superadmin@khandualoom.com}}}")
    private String superAdminEmail;

    @Value("${khandualoom.superadmin.password:${khandualoom.superadmin.password:${khandualoom.superadmin.password:Admin@123456}}}")
    private String superAdminPassword;

    @Value("${khandualoom.admin.email:${khandualoom.admin.email:${khandualoom.admin.email:admin@khandualoom.com}}}")
    private String adminEmail;

    @Value("${khandualoom.admin.password:${khandualoom.admin.password:${khandualoom.admin.password:Admin@123456}}}")
    private String adminPassword;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) throws Exception {
        // 1. Sync Super Admin (Strict ENV enforcement)
        userRepository.findByEmail(superAdminEmail).ifPresentOrElse(
            superAdmin -> {
                superAdmin.setPassword(passwordEncoder.encode(superAdminPassword));
                superAdmin.setRole("ROLE_SUPER_ADMIN");
                superAdmin.setEmailVerified(true);
                superAdmin.setPhoneVerified(true);
                userRepository.save(superAdmin);
                log.info("Super Admin account synchronized with ENV variables: {}", superAdminEmail);
            },
            () -> {
                User superAdmin = User.builder()
                        .firstName("Imperial")
                        .lastName("SuperAdmin")
                        .email(superAdminEmail)
                        .password(passwordEncoder.encode(superAdminPassword))
                        .phone("0000000000")
                        .role("ROLE_SUPER_ADMIN")
                        .emailVerified(true)
                        .phoneVerified(true)
                        .provider(AuthProvider.local)
                        .build();
                userRepository.save(superAdmin);
                log.info("Super Admin account created: {}", superAdminEmail);
            }
        );

        // 2. Safely Initialize standard Admin (Only if missing, do NOT reset password)
        userRepository.findByEmail(adminEmail).ifPresentOrElse(
            admin -> {
                // Ensure role is correct
                if (!"ROLE_ADMIN".equals(admin.getRole())) {
                    admin.setRole("ROLE_ADMIN");
                    userRepository.save(admin);
                }
                log.info("Standard Admin account already exists: {}", adminEmail);
            },
            () -> {
                User admin = User.builder()
                        .firstName("Atelier")
                        .lastName("Admin")
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .phone("9999999999")
                        .role("ROLE_ADMIN")
                        .emailVerified(true)
                        .phoneVerified(true)
                        .provider(AuthProvider.local)
                        .build();
                userRepository.save(admin);
                log.info("Default Standard Admin account created: {} / Admin@123456", adminEmail);
            }
        );
    }
}

