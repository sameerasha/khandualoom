package com.khandualoom.microservice.inventory.infrastructure.persistence.repository;

import com.khandualoom.microservice.inventory.domain.model.ReservationStatus;
import com.khandualoom.microservice.inventory.infrastructure.persistence.entity.StockReservationJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpringDataReservationRepository extends JpaRepository<StockReservationJpaEntity, UUID> {
    List<StockReservationJpaEntity> findByOrderId(Long orderId);
    Optional<StockReservationJpaEntity> findByOrderIdAndProductId(Long orderId, Long productId);

    @Query("SELECT r FROM StockReservationJpaEntity r WHERE r.status = :status AND r.expiresAt < :now")
    List<StockReservationJpaEntity> findExpiredReservations(@Param("status") ReservationStatus status, @Param("now") Instant now);
}
