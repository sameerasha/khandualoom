package com.khandualoom.microservice.user.infrastructure.persistence.repository;

import com.khandualoom.microservice.user.infrastructure.persistence.entity.AddressJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpringDataAddressRepository extends JpaRepository<AddressJpaEntity, Long> {
    List<AddressJpaEntity> findByUserId(Long userId);

    @Modifying
    @Query("UPDATE AddressJpaEntity a SET a.isPrimary = false WHERE a.userId = :userId")
    void resetPrimaryForUser(Long userId);
}
