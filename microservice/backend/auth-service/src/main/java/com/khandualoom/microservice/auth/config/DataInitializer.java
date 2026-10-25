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

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${khandualoom.superadmin.email:superadmin@khandualoom.com}")
    private String superAdminEmail;

    @Value("${khandualoom.superadmin.password:Admin@123456}")
    private String superAdminPassword;

    @Value("${khandualoom.admin.email:admin@khandualoom.com}")
    private String adminEmail;

    @Value("${khandualoom.admin.password:Admin@123456}")
    private String adminPassword;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) throws Exception {
        log.info("Initializing & synchronizing security credentials...");

        // 1. Super Admin Canonical & Aliases
        List<String> superAdminEmails = List.of(
                superAdminEmail,
                "superadmin@khandualoom.com",
                "superadmin@khadualooms.com",
                "superadmin@khandualooms.com",
                "superadmin@khadualoom.com"
        );
        for (String email : superAdminEmails) {
            upsertUser(email, "Imperial", "SuperAdmin", superAdminPassword, "ROLE_SUPER_ADMIN", "0000000000");
        }

        // 2. Standard Admin Canonical & Aliases
        List<String> adminEmails = List.of(
                adminEmail,
                "admin@khandualoom.com",
                "admin@khadualooms.com",
                "admin@khandualooms.com",
                "admin@khadualoom.com"
        );
        for (String email : adminEmails) {
            upsertUser(email, "Atelier", "Admin", adminPassword, "ROLE_ADMIN", "9999999999");
        }

        // 3. Demo Patron Account (AuthModal quick-fill)
        upsertUser("priya.sharma@gmail.com", "Priya", "Sharma", "Patron@123", "ROLE_USER", "9876543211");

        // 4. Regular Demo User Account
        upsertUser("user@khandualoom.com", "Ananya", "Patnaik", "User@123456", "ROLE_USER", "9876543210");

        // 5. Demo Customer Account
        upsertUser("customer@khandualoom.com", "Priya", "Mohanty", "User@123456", "ROLE_USER", "9123456789");

        log.info("All user credentials initialized and verified successfully.");
    }

    private void upsertUser(String email, String firstName, String lastName, String rawPassword, String role, String phone) {
        userRepository.findByEmail(email).ifPresentOrElse(
                user -> {
                    user.setFirstName(firstName);
                    user.setLastName(lastName);
                    user.setPassword(passwordEncoder.encode(rawPassword));
                    user.setRole(role);
                    user.setPhone(phone);
                    user.setEmailVerified(true);
                    user.setPhoneVerified(true);
                    userRepository.save(user);
                    log.info("Synchronized credentials for: {} [{}]", email, role);
                },
                () -> {
                    User newUser = User.builder()
                            .firstName(firstName)
                            .lastName(lastName)
                            .email(email)
                            .password(passwordEncoder.encode(rawPassword))
                            .phone(phone)
                            .role(role)
                            .emailVerified(true)
                            .phoneVerified(true)
                            .provider(AuthProvider.local)
                            .build();
                    userRepository.save(newUser);
                    log.info("Created account for: {} [{}]", email, role);
                }
        );
    }
}
