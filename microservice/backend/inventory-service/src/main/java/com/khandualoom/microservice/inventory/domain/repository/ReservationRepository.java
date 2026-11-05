package com.khandualoom.microservice.inventory.domain.repository;

import com.khandualoom.microservice.inventory.domain.model.ReservationStatus;
import com.khandualoom.microservice.inventory.domain.model.StockReservation;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository {
    StockReservation save(StockReservation reservation);
    Optional<StockReservation> findById(UUID id);
    Optional<StockReservation> findByOrderIdAndProductId(Long orderId, Long productId);
    List<StockReservation> findByOrderId(Long orderId);
    List<StockReservation> findExpiredReservations(Instant now);
    int atomicTransitionStatus(UUID id, ReservationStatus expectedStatus, ReservationStatus newStatus);
}
