package com.vastraloom.api.config;

import com.vastraloom.api.model.AuthProvider;
import com.vastraloom.api.model.User;
import com.vastraloom.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @SuppressWarnings("null")
    public void run(String... args) throws Exception {
        userRepository.findByEmail("admin@vastraloom.com").ifPresentOrElse(
            admin -> {
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ROLE_ADMIN");
                admin.setEmailVerified(true);
                admin.setPhoneVerified(true);
                userRepository.save(admin);
                log.info("Default Admin account synchronized: admin@vastraloom.com / admin123");
            },
            () -> {
                User admin = User.builder()
                        .firstName("Super")
                        .lastName("Admin")
                        .email("admin@vastraloom.com")
                        .password(passwordEncoder.encode("admin123"))
                        .phone("9999999999")
                        .role("ROLE_ADMIN")
                        .emailVerified(true)
                        .phoneVerified(true)
                        .provider(AuthProvider.local)
                        .build();
                userRepository.save(admin);
                log.info("Default Admin account created: admin@vastraloom.com / admin123");
            }
        );
    }
}
