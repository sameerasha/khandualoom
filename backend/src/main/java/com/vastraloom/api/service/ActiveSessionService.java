package com.vastraloom.api.service;

import com.vastraloom.api.model.ActiveSession;
import com.vastraloom.api.repository.ActiveSessionRepository;
import com.vastraloom.api.security.JwtTokenProvider;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class ActiveSessionService {

    private final ActiveSessionRepository activeSessionRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CacheManager cacheManager;

    public ActiveSessionService(ActiveSessionRepository activeSessionRepository, JwtTokenProvider jwtTokenProvider, CacheManager cacheManager) {
        this.activeSessionRepository = activeSessionRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.cacheManager = cacheManager;
    }

    @Transactional
    public void createSession(String token, String email) {
        try {
            // Remove existing sessions for this email to maintain 1 active session per user
            List<ActiveSession> existingSessions = activeSessionRepository.findByEmail(email);
            for (ActiveSession existing : existingSessions) {
                if (cacheManager.getCache("activeSessions") != null) {
                    cacheManager.getCache("activeSessions").evict(existing.getToken());
                }
                activeSessionRepository.delete(existing);
            }
            activeSessionRepository.flush();

            Date expiryDate = jwtTokenProvider.getExpirationDateFromJWT(token);
            ActiveSession session = ActiveSession.builder()
                    .token(token)
                    .email(email)
                    .expiryDate(expiryDate)
                    .build();
            activeSessionRepository.save(session);
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
                    long maxAllowedExpiry = nowMillis + (24 * 60 * 60 * 1000L); // 24 hours from now

                    boolean isNotExpired = session.getExpiryDate().after(new Date(nowMillis));
                    boolean isNotSuspicious = session.getExpiryDate().before(new Date(maxAllowedExpiry));
                    
                    return isNotExpired && isNotSuspicious;
                })
                .orElse(false);
    }

    @Transactional
    @Scheduled(fixedRate = 3600000) // Runs every 1 hour (3,600,000 ms)
    public void cleanupExpiredSessions() {
        System.out.println("Running scheduled cleanup for expired sessions...");
        activeSessionRepository.deleteByExpiryDateBefore(new Date());
    }

    @Transactional
    @CacheEvict(value = "activeSessions", key = "#p0")
    public void removeSession(String token) {
        if (token != null) {
            activeSessionRepository.deleteByToken(token);
        }
    }
}
