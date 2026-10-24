package com.vastraloom.microservice.auth.service;

import com.vastraloom.microservice.auth.repository.AppConfigRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;
import lombok.extern.slf4j.Slf4j;

import lombok.RequiredArgsConstructor;

@Service
@Slf4j
@RequiredArgsConstructor
public class OtpService {

    private final AppConfigRepository appConfigRepository;
    private final EmailService emailService;
    private final SmsService smsService;


    // Stores OtpDetails keyed by email or phone
    private final Map<String, OtpDetails> otpCache = new ConcurrentHashMap<>();

    private static class OtpDetails {
        String otp;
        long expiryTime;
        int attempts;
        boolean verified;

        OtpDetails(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
            this.attempts = 0;
            this.verified = false;
        }
    }

    public int getTtlMinutes() {
        return appConfigRepository.findById("OTP_VALIDITY_MINUTES")
                .map(config -> Integer.parseInt(config.getConfigValue()))
                .orElse(2);
    }

    public int getMaxAttempts() {
        return appConfigRepository.findById("OTP_MAX_ATTEMPTS")
                .map(config -> Integer.parseInt(config.getConfigValue()))
                .orElse(5);
    }

    public Map<String, Object> generateAndSendOtp(String identifier) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        int ttlMinutes = getTtlMinutes();
        int maxAttempts = getMaxAttempts();
        
        long expiry = System.currentTimeMillis() + (ttlMinutes * 60 * 1000L);
        
        otpCache.put(identifier, new OtpDetails(otp, expiry));
        log.info("=================================================");
        log.info(">>> DISPATCHING OTP (Email) <<<");
        log.info("To: {}", identifier);
        log.info("OTP CODE: {}", otp);
        log.info("Expiry: {} minutes", ttlMinutes);
        log.info("=================================================");

        if (identifier.contains("@")) {
            // It's an email
            emailService.sendOtpEmail(identifier, otp, ttlMinutes);
        } else {
            // It's a phone number
            smsService.sendOtpSms(identifier, otp, ttlMinutes);
        }

        return Map.of(
            "message", "OTP sent successfully to " + identifier,
            "ttlSeconds", ttlMinutes * 60,
            "maxAttempts", maxAttempts,
            "mockOtp", otp // Temporary fallback for SMTP testing
        );
    }

    public boolean verifyOtp(String identifier, String providedOtp) {
        return verifyInternal(identifier, providedOtp, true);
    }

    public boolean verifyOtpStep(String identifier, String providedOtp) {
        return verifyInternal(identifier, providedOtp, false);
    }

    private boolean verifyInternal(String identifier, String providedOtp, boolean consume) {
        OtpDetails details = otpCache.get(identifier);

        if (details == null) {
            log.warn("OTP verification failed: No OTP found for identifier {}", identifier);
            throw new IllegalArgumentException("No OTP found for this identifier or it has expired.");
        }

        if (System.currentTimeMillis() > details.expiryTime) {
            otpCache.remove(identifier);
            log.warn("OTP verification failed: OTP expired for identifier {}", identifier);
            throw new IllegalArgumentException("OTP has expired.");
        }

        if (details.verified && details.otp.equals(providedOtp)) {
            if (consume) {
                otpCache.remove(identifier);
                log.info("OTP consumed successfully for identifier {}", identifier);
            }
            return true;
        }

        int maxAttempts = getMaxAttempts();
        details.attempts++;
        
        log.debug("OTP verification attempt {}/{} for identifier {}", details.attempts, maxAttempts, identifier);
        
        if (details.attempts > maxAttempts) {
            otpCache.remove(identifier);
            log.error("OTP verification failed: Max attempts exceeded for identifier {}", identifier);
            throw new IllegalArgumentException("Maximum OTP attempts exceeded. Please request a new one.");
        }

        if (details.otp.equals(providedOtp)) {
            details.verified = true;
            log.info("OTP verified successfully for identifier {}", identifier);
            if (consume) {
                otpCache.remove(identifier);
                log.info("OTP consumed successfully for identifier {}", identifier);
            }
            return true;
        }

        log.warn("OTP verification failed: Invalid OTP provided for identifier {}", identifier);
        throw new IllegalArgumentException("Invalid OTP. Attempts remaining: " + (maxAttempts - details.attempts));
    }

    public void consumeOtp(String identifier, String providedOtp) {
        OtpDetails details = otpCache.get(identifier);
        if (details != null && details.verified && details.otp.equals(providedOtp)) {
            otpCache.remove(identifier);
        } else if (details != null && details.otp.equals(providedOtp)) {
            verifyInternal(identifier, providedOtp, true);
        } else {
            throw new IllegalArgumentException("Invalid or unverified OTP.");
        }
    }
}

