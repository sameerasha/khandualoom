package com.vastraloom.microservice.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@SuppressWarnings("null")
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${vastraloom.mail.from:vastraloom@example.com}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp, int ttlMinutes) {
        CompletableFuture.runAsync(() -> {
            if (mailSender == null) {
                log.info("[DEV MOCK] Verification OTP for {}: {} (valid for {} mins)", toEmail, otp, ttlMinutes);
                return;
            }
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail);
                helper.setTo(toEmail);
                helper.setSubject("Your Vastra Loom Verification Code");

                String htmlMsg = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;'>"
                        +
                        "<h2 style='color: #c3a27e; text-align: center;'>Vastra Loom</h2>" +
                        "<p style='font-size: 16px; color: #333;'>Hello,</p>" +
                        "<p style='font-size: 16px; color: #333;'>Your One-Time Password (OTP) for Vastra Loom is:</p>"
                        +
                        "<div style='text-align: center; margin: 20px 0;'>" +
                        "<span style='font-size: 32px; font-weight: bold; color: #c3a27e; letter-spacing: 5px; padding: 10px 20px; background-color: #f9f9f9; border-radius: 5px; display: inline-block;'>"
                        + otp + "</span>" +
                        "</div>" +
                        "<p style='font-size: 14px; color: #666;'>This code is valid for <strong>" + ttlMinutes
                        + " minutes</strong>. Please do not share this code with anyone.</p>" +
                        "<hr style='border-top: 1px solid #e0e0e0; margin: 30px 0;' />" +
                        "<p style='font-size: 12px; color: #999; text-align: center;'>If you did not request this code, please ignore this email.</p>"
                        +
                        "</div>";

                helper.setText(htmlMsg, true);

                mailSender.send(message);
                log.info("Email successfully sent to {}", toEmail);
            } catch (MessagingException e) {
                log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            } catch (Exception e) {
                log.error("Mail server error: {}", e.getMessage());
            }
        });
    }
}

