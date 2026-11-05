package com.khandualoom.microservice.user.infrastructure.persistence.adapter;

import com.khandualoom.microservice.user.domain.model.UserProfile;
import com.khandualoom.microservice.user.domain.repository.UserProfileRepository;
import com.khandualoom.microservice.user.infrastructure.persistence.entity.UserProfileJpaEntity;
import com.khandualoom.microservice.user.infrastructure.persistence.repository.SpringDataUserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserProfilePersistenceAdapter implements UserProfileRepository {

    private final SpringDataUserProfileRepository repository;

    @Override
    public UserProfile save(UserProfile userProfile) {
        UserProfileJpaEntity entity = toEntity(userProfile);
        UserProfileJpaEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<UserProfile> findByUserId(Long userId) {
        return repository.findByUserId(userId).map(this::toDomain);
    }

    @Override
    public Optional<UserProfile> findByEmail(String email) {
        return repository.findByEmail(email).map(this::toDomain);
    }

    @Override
    public List<UserProfile> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }

    private UserProfile toDomain(UserProfileJpaEntity entity) {
        return UserProfile.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .email(entity.getEmail())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .phone(entity.getPhone())
                .role(entity.getRole())
                .createdDate(entity.getCreatedDate())
                .modifiedDate(entity.getModifiedDate())
                .build();
    }

    private UserProfileJpaEntity toEntity(UserProfile domain) {
        return UserProfileJpaEntity.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .email(domain.getEmail())
                .firstName(domain.getFirstName())
                .lastName(domain.getLastName())
                .phone(domain.getPhone())
                .role(domain.getRole())
                .createdDate(domain.getCreatedDate())
                .modifiedDate(domain.getModifiedDate())
                .build();
    }
}
