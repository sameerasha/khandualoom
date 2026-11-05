package com.khandualoom.microservice.user.infrastructure.persistence.repository;

import com.khandualoom.microservice.user.infrastructure.persistence.entity.UserProfileJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpringDataUserProfileRepository extends JpaRepository<UserProfileJpaEntity, Long> {
    Optional<UserProfileJpaEntity> findByUserId(Long userId);
    Optional<UserProfileJpaEntity> findByEmail(String email);
    boolean existsByEmail(String email);
}
