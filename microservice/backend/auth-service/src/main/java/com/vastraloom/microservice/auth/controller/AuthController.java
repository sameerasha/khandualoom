package com.vastraloom.microservice.auth.controller;

import com.vastraloom.microservice.auth.dto.JwtAuthenticationResponse;
import com.vastraloom.microservice.auth.dto.LoginRequest;
import com.vastraloom.microservice.auth.dto.OtpLoginRequest;
import com.vastraloom.microservice.auth.dto.RefreshTokenRequest;
import com.vastraloom.microservice.auth.dto.ResetPasswordRequest;
import com.vastraloom.microservice.auth.dto.SignupRequest;
import com.vastraloom.microservice.auth.model.User;
import com.vastraloom.microservice.auth.repository.UserRepository;
import com.vastraloom.microservice.auth.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.vastraloom.microservice.auth.service.OtpService;
import jakarta.validation.Valid;

import java.util.Map;
import lombok.extern.slf4j.Slf4j;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@SuppressWarnings("null")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final com.vastraloom.microservice.auth.service.ActiveSessionService activeSessionService;


    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(jakarta.servlet.http.HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (org.springframework.util.StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String jwt = bearerToken.substring(7);
            activeSessionService.removeSession(jwt);
            log.info("Token successfully removed from active sessions during logout.");
        }
        return ResponseEntity.ok("Successfully logged out");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Attempting to authenticate user: {}", loginRequest.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.generateToken(authentication);
            org.springframework.security.core.userdetails.UserDetails userDetails = 
                    (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();
            String refreshToken = tokenProvider.generateRefreshToken(userDetails.getUsername());
            String role = userDetails.getAuthorities().stream()
                    .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("ROLE_USER");
                    
            activeSessionService.createSession(jwt, refreshToken, userDetails.getUsername());
            
            log.info("User {} successfully authenticated with role {}", loginRequest.getEmail(), role);
            return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, refreshToken, userDetails.getUsername(), role)); // username here actually holds the email
        } catch (org.springframework.security.core.AuthenticationException e) {
            log.error("Authentication failed for {}: {}", loginRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");
        String intent = request.get("intent"); // 'login' or 'signup'
        
        if (identifier == null || identifier.isBlank()) {
            return ResponseEntity.badRequest().body("Identifier (email or phone) is required.");
        }
        
        // Validate based on intent
        boolean exists = userRepository.findByEmail(identifier).isPresent() || 
                         userRepository.findByPhone(identifier).isPresent();
                         
        if ("login".equalsIgnoreCase(intent) || "forgot".equalsIgnoreCase(intent)) {
            if (!exists) {
                return ResponseEntity.badRequest().body("Email is not registered. Register first to login.");
            }
        } else if ("signup".equalsIgnoreCase(intent)) {
            if (exists) {
                return ResponseEntity.badRequest().body("Email is already registered.");
            }
        }
        
        try {
            log.info("Requesting OTP for identifier: {} with intent: {}", identifier, intent);
            Map<String, Object> result = otpService.generateAndSendOtp(identifier);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Failed to generate/send OTP for {}: {}", identifier, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify-otp-step")
    public ResponseEntity<?> verifyOtpStep(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");
        String otp = request.get("otp");
        if (identifier == null || otp == null) {
            return ResponseEntity.badRequest().body("Identifier and OTP are required.");
        }
        
        try {
            log.debug("Verifying OTP step for identifier: {}", identifier);
            otpService.verifyOtpStep(identifier, otp);
            log.info("OTP successfully verified for {}", identifier);
            return ResponseEntity.ok("OTP verified successfully. You may proceed.");
        } catch (Exception e) {
            log.warn("OTP verification failed for {}: {}", identifier, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login-otp")
    public ResponseEntity<?> loginWithOtp(@Valid @RequestBody OtpLoginRequest request) {
        try {
            otpService.consumeOtp(request.getIdentifier(), request.getOtp());
            
            User user = userRepository.findByEmail(request.getIdentifier())
                .orElseGet(() -> userRepository.findByPhone(request.getIdentifier())
                    .orElseThrow(() -> new RuntimeException("User not found")));
            
            // Generate token directly for the user
            org.springframework.security.core.userdetails.UserDetails userDetails = 
                new org.springframework.security.core.userdetails.User(
                    user.getEmail(), "", 
                    java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(user.getRole()))
                );
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());
            
            activeSessionService.createSession(jwt, refreshToken, user.getEmail());
            
            log.info("User {} successfully logged in via OTP", user.getEmail());
            return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, refreshToken, user.getEmail(), user.getRole()));
        } catch (Exception e) {
            log.error("OTP Login failed for {}: {}", request.getIdentifier(), e.getMessage());
            return ResponseEntity.badRequest().body("OTP Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            otpService.consumeOtp(request.getIdentifier(), request.getOtp());
            
            User user = userRepository.findByEmail(request.getIdentifier())
                .orElseGet(() -> userRepository.findByPhone(request.getIdentifier())
                    .orElseThrow(() -> new RuntimeException("User not found")));
            
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            
            log.info("Password successfully reset for {}", user.getEmail());
            return ResponseEntity.ok("Password reset successfully!");
        } catch (Exception e) {
            log.error("Password reset failed for {}: {}", request.getIdentifier(), e.getMessage());
            return ResponseEntity.badRequest().body("Password reset failed: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        log.info("Received signup request for email: {}", signupRequest.getEmail());
        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            log.warn("Signup failed: Email {} is already registered", signupRequest.getEmail());
            return ResponseEntity.badRequest().body("Error: Email is already registered!");
        }

        try {
            // Consume OTP for signup
            try {
                otpService.consumeOtp(signupRequest.getEmail(), signupRequest.getOtp());
            } catch (Exception e) {
                if (signupRequest.getPhone() != null && !signupRequest.getPhone().isBlank()) {
                    otpService.consumeOtp(signupRequest.getPhone(), signupRequest.getOtp());
                } else {
                    throw e;
                }
            }
        } catch (Exception e) {
            log.error("OTP Verification failed during signup for {}: {}", signupRequest.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body("OTP Verification failed: " + e.getMessage());
        }

        // Create new customer account
        User user = User.builder()
                .firstName(signupRequest.getFirstName())
                .lastName(signupRequest.getLastName())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .phone(signupRequest.getPhone())
                .role("ROLE_USER")
                .emailVerified(true) // Assumed verified since OTP passed during signup
                .build();

        userRepository.save(user);

        log.info("User registered successfully: {}", signupRequest.getEmail());
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/signup-admin")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody SignupRequest signupRequest) {
        log.info("Received admin signup request for email: {}", signupRequest.getEmail());
        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            log.warn("Admin signup failed: Email {} is already registered", signupRequest.getEmail());
            return ResponseEntity.badRequest().body("Error: Email is already registered!");
        }

        try {
            otpService.consumeOtp(signupRequest.getEmail(), signupRequest.getOtp());
        } catch (Exception e) {
            log.error("OTP Verification failed during admin signup for {}: {}", signupRequest.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body("OTP Verification failed: " + e.getMessage());
        }

        User user = User.builder()
                .firstName(signupRequest.getFirstName())
                .lastName(signupRequest.getLastName())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .phone(signupRequest.getPhone())
                .role("ROLE_ADMIN")
                .emailVerified(true)
                .build();

        userRepository.save(user);
        
        log.info("Admin user registered successfully: {}", signupRequest.getEmail());
        return ResponseEntity.ok("Admin registered successfully!");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        try {
            if (org.springframework.util.StringUtils.hasText(requestRefreshToken) && tokenProvider.validateToken(requestRefreshToken)) {
                String email = tokenProvider.getEmailFromJWT(requestRefreshToken);
                
                com.vastraloom.microservice.auth.model.ActiveSession session = activeSessionService.findByRefreshToken(requestRefreshToken);
                if (session == null) {
                    return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body("Refresh token not found in database. Please log in again.");
                }

                // Generate new tokens
                String newAccessToken = tokenProvider.generateTokenFromEmail(email);
                String newRefreshToken = tokenProvider.generateRefreshToken(email);

                activeSessionService.rotateSessionTokens(session, newAccessToken, newRefreshToken);

                User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

                log.info("Access token successfully refreshed for user: {}", email);
                return ResponseEntity.ok(new JwtAuthenticationResponse(newAccessToken, newRefreshToken, email, user.getRole()));
            }
        } catch (Exception ex) {
            log.error("Failed to refresh token: {}", ex.getMessage());
        }
        
        return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body("Invalid Refresh Token");
    }
}

