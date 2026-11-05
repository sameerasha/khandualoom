package com.khandualoom.microservice.user.domain.repository;

import com.khandualoom.microservice.user.domain.model.UserProfile;

import java.util.List;
import java.util.Optional;

public interface UserProfileRepository {
    UserProfile save(UserProfile userProfile);
    Optional<UserProfile> findByUserId(Long userId);
    Optional<UserProfile> findByEmail(String email);
    List<UserProfile> findAll();
    boolean existsByEmail(String email);
}
