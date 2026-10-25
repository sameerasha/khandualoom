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

        // 2. Safely Initialize standard Admin (Only if missing, or update password)
        userRepository.findByEmail(adminEmail).ifPresentOrElse(
            admin -> {
                admin.setRole("ROLE_ADMIN");
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setEmailVerified(true);
                admin.setPhoneVerified(true);
                userRepository.save(admin);
                log.info("Standard Admin account synchronized: {}", adminEmail);
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

        // 3. Demo Regular User Account (user@khandualoom.com / User@123456)
        userRepository.findByEmail("user@khandualoom.com").ifPresentOrElse(
            user -> {
                user.setPassword(passwordEncoder.encode("User@123456"));
                user.setRole("ROLE_USER");
                user.setEmailVerified(true);
                user.setPhoneVerified(true);
                userRepository.save(user);
                log.info("Demo user synchronized: user@khandualoom.com");
            },
            () -> {
                User user = User.builder()
                        .firstName("Ananya")
                        .lastName("Patnaik")
                        .email("user@khandualoom.com")
                        .password(passwordEncoder.encode("User@123456"))
                        .phone("9876543210")
                        .role("ROLE_USER")
                        .emailVerified(true)
                        .phoneVerified(true)
                        .provider(AuthProvider.local)
                        .build();
                userRepository.save(user);
                log.info("Demo User account created: user@khandualoom.com / User@123456");
            }
        );

        // 4. Demo Customer Account (customer@khandualoom.com / User@123456)
        userRepository.findByEmail("customer@khandualoom.com").ifPresentOrElse(
            cust -> {
                cust.setPassword(passwordEncoder.encode("User@123456"));
                cust.setRole("ROLE_USER");
                cust.setEmailVerified(true);
                cust.setPhoneVerified(true);
                userRepository.save(cust);
                log.info("Demo customer synchronized: customer@khandualoom.com");
            },
            () -> {
                User cust = User.builder()
                        .firstName("Priya")
                        .lastName("Mohanty")
                        .email("customer@khandualoom.com")
                        .password(passwordEncoder.encode("User@123456"))
                        .phone("9123456789")
                        .role("ROLE_USER")
                        .emailVerified(true)
                        .phoneVerified(true)
                        .provider(AuthProvider.local)
                        .build();
                userRepository.save(cust);
                log.info("Demo Customer account created: customer@khandualoom.com / User@123456");
            }
        );
    }
}
