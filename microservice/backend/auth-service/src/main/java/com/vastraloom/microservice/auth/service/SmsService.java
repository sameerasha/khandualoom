package com.vastraloom.microservice.auth.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SmsService {

    /**
     * Simulated SMS sender.
     * In a production environment, you would integrate the Twilio SDK (or AWS SNS) here.
     */
    public void sendOtpSms(String phoneNumber, String otp, int ttlMinutes) {
        CompletableFuture.runAsync(() -> {
            try {
                // Simulate network latency
                Thread.sleep(500);
                
                String message = String.format("Vastra Loom: Your verification code is %s. It is valid for %d minutes. Do not share it with anyone.", otp, ttlMinutes);
                
                log.info("=================================================");
                log.info(">>> SIMULATED SMS DISPATCH <<<");
                log.info("To: {}", phoneNumber);
                log.info("Message: {}", message);
                log.info("=================================================");
                
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("SMS simulation interrupted", e);
            }
        });
    }
}

