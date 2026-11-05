package com.khandualoom.microservice.auth.service;

import com.khandualoom.microservice.auth.model.ActiveSession;
import com.khandualoom.microservice.auth.repository.ActiveSessionRepository;
import com.khandualoom.microservice.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HexFormat;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActiveSessionService {

    private final ActiveSessionRepository activeSessionRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CacheManager cacheManager;

    public static String hashToken(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }

    @Transactional
    public void createSession(String token, String refreshToken, String email) {
        try {
            String tokenHash = hashToken(token);
            String refreshHash = hashToken(refreshToken);

            // Invalidate any existing sessions for this email to enforce 1 active session
            List<ActiveSession> existingSessions = activeSessionRepository.findByEmail(email);
            org.springframework.cache.Cache cache = cacheManager.getCache("activeSessions");

            for (ActiveSession existing : existingSessions) {
                if (cache != null && existing.getToken() != null) {
                    cache.evict(existing.getToken());
                }
                activeSessionRepository.delete(existing);
            }
            activeSessionRepository.flush();

            Date expiryDate = jwtTokenProvider.getExpirationDateFromJWT(token);
            Date refreshExpiryDate = refreshToken != null ? jwtTokenProvider.getExpirationDateFromJWT(refreshToken) : null;

            ActiveSession session = ActiveSession.builder()
                    .token(tokenHash)
                    .refreshToken(refreshHash)
                    .email(email)
                    .expiryDate(expiryDate)
                    .refreshExpiryDate(refreshExpiryDate)
                    .build();

            activeSessionRepository.save(session);
            log.info("Secure hashed session created for user: {}", email);
        } catch (Exception e) {
            log.error("Failed to create secure session for {}: {}", email, e.getMessage(), e);
        }
    }

    @Cacheable(value = "activeSessions", key = "#p0")
    public boolean isValidSession(String token) {
        String tokenHash = hashToken(token);
        return activeSessionRepository.findByToken(tokenHash)
                .or(() -> activeSessionRepository.findByToken(token)) // fallback for non-hashed legacy sessions
                .map(session -> {
                    long nowMillis = System.currentTimeMillis();
                    long maxAllowedExpiry = nowMillis + (24 * 60 * 60 * 1000L);
                    boolean isNotExpired = session.getExpiryDate().after(new Date(nowMillis));
                    boolean isNotSuspicious = session.getExpiryDate().before(new Date(maxAllowedExpiry));
                    return isNotExpired && isNotSuspicious;
                })
                .orElse(false);
    }

    public ActiveSession findByRefreshToken(String refreshToken) {
        String refreshHash = hashToken(refreshToken);
        return activeSessionRepository.findByRefreshToken(refreshHash)
                .or(() -> activeSessionRepository.findByRefreshToken(refreshToken))
                .orElse(null);
    }

    @Transactional
    public void rotateSessionTokens(ActiveSession session, String newAccessToken, String newRefreshToken) {
        if (session.getToken() != null) {
            org.springframework.cache.Cache cache = cacheManager.getCache("activeSessions");
            if (cache != null) {
                cache.evict(session.getToken());
            }
        }
        session.setToken(hashToken(newAccessToken));
        session.setRefreshToken(hashToken(newRefreshToken));
        session.setExpiryDate(jwtTokenProvider.getExpirationDateFromJWT(newAccessToken));
        session.setRefreshExpiryDate(jwtTokenProvider.getExpirationDateFromJWT(newRefreshToken));
        activeSessionRepository.save(session);
        log.info("Session tokens rotated with reuse-safe hashes for: {}", session.getEmail());
    }

    @Transactional
    @CacheEvict(value = "activeSessions", key = "#p0")
    public void removeSession(String token) {
        if (token != null) {
            String tokenHash = hashToken(token);
            activeSessionRepository.deleteByToken(tokenHash);
            activeSessionRepository.deleteByToken(token); // cleanup legacy if any
        }
    }

    @Transactional
    public void revokeAllUserSessions(String email) {
        log.warn("Security Alert: Revoking all active sessions for potentially compromised user: {}", email);
        List<ActiveSession> sessions = activeSessionRepository.findByEmail(email);
        org.springframework.cache.Cache cache = cacheManager.getCache("activeSessions");
        for (ActiveSession s : sessions) {
            if (cache != null && s.getToken() != null) {
                cache.evict(s.getToken());
            }
            activeSessionRepository.delete(s);
        }
    }

    @Transactional
    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredSessions() {
        Date now = new Date();
        activeSessionRepository.findAll().forEach(session -> {
            boolean accessExpired = session.getExpiryDate() != null && session.getExpiryDate().before(now);
            boolean refreshExpired = session.getRefreshExpiryDate() == null || session.getRefreshExpiryDate().before(now);
            if (accessExpired && refreshExpired) {
                if (session.getToken() != null) {
                    org.springframework.cache.Cache cache = cacheManager.getCache("activeSessions");
                    if (cache != null) {
                        cache.evict(session.getToken());
                    }
                }
                activeSessionRepository.delete(session);
            }
        });
    }
}
