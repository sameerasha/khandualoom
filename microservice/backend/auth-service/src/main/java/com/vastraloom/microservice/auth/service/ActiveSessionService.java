package com.vastraloom.microservice.auth.service;

import com.vastraloom.microservice.auth.model.ActiveSession;
import com.vastraloom.microservice.auth.repository.ActiveSessionRepository;
import com.vastraloom.microservice.auth.security.JwtTokenProvider;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActiveSessionService {

    private final ActiveSessionRepository activeSessionRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CacheManager cacheManager;


    @Transactional
    @SuppressWarnings("null")
    public void createSession(String token, String refreshToken, String email) {
        try {
            // Remove existing sessions for this email to maintain 1 active session per user
            List<ActiveSession> existingSessions = activeSessionRepository.findByEmail(email);
            org.springframework.cache.Cache activeSessionsCache = cacheManager.getCache("activeSessions");
            
            for (ActiveSession existing : existingSessions) {
                if (activeSessionsCache != null && existing.getToken() != null) {
                    activeSessionsCache.evict(existing.getToken());
                }
                if (existing != null) {
                    activeSessionRepository.delete(existing);
                }
            }
            activeSessionRepository.flush();

            Date expiryDate = jwtTokenProvider.getExpirationDateFromJWT(token);
            Date refreshExpiryDate = refreshToken != null ? jwtTokenProvider.getExpirationDateFromJWT(refreshToken) : null;
            ActiveSession session = ActiveSession.builder()
                    .token(token)
                    .refreshToken(refreshToken)
                    .email(email)
                    .expiryDate(expiryDate)
                    .refreshExpiryDate(refreshExpiryDate)
                    .build();
            if (session != null) {
                activeSessionRepository.save(session);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to create session: " + e.getMessage());
        }
    }

    @Cacheable(value = "activeSessions", key = "#p0")
    public boolean isValidSession(String token) {
        return activeSessionRepository.findByToken(token)
                .map(session -> {
                    long nowMillis = System.currentTimeMillis();
                    long maxAllowedExpiry = nowMillis + (24 * 60 * 60 * 1000L); // Max sanity check

                    boolean isNotExpired = session.getExpiryDate().after(new Date(nowMillis));
                    boolean isNotSuspicious = session.getExpiryDate().before(new Date(maxAllowedExpiry));
                    
                    return isNotExpired && isNotSuspicious;
                })
                .orElse(false);
    }

    public ActiveSession findByRefreshToken(String refreshToken) {
        return activeSessionRepository.findByRefreshToken(refreshToken).orElse(null);
    }

    @Transactional
    @Scheduled(fixedRate = 3600000) // Runs every 1 hour (3,600,000 ms)
    public void cleanupExpiredSessions() {
        System.out.println("Running scheduled cleanup for expired sessions...");
        Date now = new Date();
        // Delete sessions where both access token AND refresh token (if it exists) are expired
        // But for simplicity, we'll just check if refreshExpiryDate is not null and before now, 
        // OR (refreshExpiryDate is null AND expiryDate before now)
        activeSessionRepository.findAll().forEach(session -> {
            boolean accessExpired = session.getExpiryDate() != null && session.getExpiryDate().before(now);
            boolean refreshExpired = session.getRefreshExpiryDate() == null || session.getRefreshExpiryDate().before(now);
            
            if (accessExpired && refreshExpired) {
                if (session.getToken() != null) {
                    org.springframework.cache.Cache activeSessionsCache = cacheManager.getCache("activeSessions");
                    if (activeSessionsCache != null) {
                        activeSessionsCache.evict(session.getToken());
                    }
                }
                activeSessionRepository.delete(session);
            }
        });
    }

    @Transactional
    @CacheEvict(value = "activeSessions", key = "#p0")
    public void removeSession(String token) {
        if (token != null) {
            activeSessionRepository.deleteByToken(token);
        }
    }
    @Transactional
    public void rotateSessionTokens(ActiveSession session, String newAccessToken, String newRefreshToken) {
        if (session.getToken() != null) {
            org.springframework.cache.Cache activeSessionsCache = cacheManager.getCache("activeSessions");
            if (activeSessionsCache != null) {
                activeSessionsCache.evict(session.getToken());
            }
        }
        session.setToken(newAccessToken);
        session.setRefreshToken(newRefreshToken);
        session.setExpiryDate(jwtTokenProvider.getExpirationDateFromJWT(newAccessToken));
        session.setRefreshExpiryDate(jwtTokenProvider.getExpirationDateFromJWT(newRefreshToken));
        activeSessionRepository.save(session);
    }
}

