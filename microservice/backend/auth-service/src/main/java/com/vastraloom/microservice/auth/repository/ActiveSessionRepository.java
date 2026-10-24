package com.vastraloom.microservice.auth.repository;

import com.vastraloom.microservice.auth.model.ActiveSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface ActiveSessionRepository extends JpaRepository<ActiveSession, Long> {
    boolean existsByToken(String token);
    java.util.Optional<ActiveSession> findByToken(String token);
    void deleteByToken(String token);
    java.util.Optional<ActiveSession> findByRefreshToken(String refreshToken);
    void deleteByRefreshToken(String refreshToken);
    java.util.List<ActiveSession> findByEmail(String email);
    void deleteByExpiryDateBefore(Date now);
}

