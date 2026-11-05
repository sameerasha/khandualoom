package com.khandualoom.microservice.inventory.infrastructure.persistence.adapter;

import com.khandualoom.microservice.inventory.domain.model.ReservationStatus;
import com.khandualoom.microservice.inventory.domain.model.StockReservation;
import com.khandualoom.microservice.inventory.domain.repository.ReservationRepository;
import com.khandualoom.microservice.inventory.infrastructure.persistence.entity.StockReservationJpaEntity;
import com.khandualoom.microservice.inventory.infrastructure.persistence.repository.SpringDataReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ReservationPersistenceAdapter implements ReservationRepository {

    private final SpringDataReservationRepository repository;

    @Override
    public StockReservation save(StockReservation domain) {
        StockReservationJpaEntity entity = toEntity(domain);
        StockReservationJpaEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<StockReservation> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<StockReservation> findByOrderIdAndProductId(Long orderId, Long productId) {
        return repository.findByOrderIdAndProductId(orderId, productId).map(this::toDomain);
    }

    @Override
    public List<StockReservation> findByOrderId(Long orderId) {
        return repository.findByOrderId(orderId).stream().map(this::toDomain).toList();
    }

    @Override
    public List<StockReservation> findExpiredReservations(Instant now) {
        return repository.findExpiredReservations(ReservationStatus.RESERVED, now).stream().map(this::toDomain).toList();
    }

    @Override
    public int atomicTransitionStatus(UUID id, ReservationStatus expectedStatus, ReservationStatus newStatus) {
        return repository.atomicTransitionStatus(id, expectedStatus, newStatus);
    }

    private StockReservation toDomain(StockReservationJpaEntity entity) {
        return StockReservation.builder()
                .id(entity.getId())
                .orderId(entity.getOrderId())
                .productId(entity.getProductId())
                .quantity(entity.getQuantity())
                .status(entity.getStatus())
                .expiresAt(entity.getExpiresAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private StockReservationJpaEntity toEntity(StockReservation domain) {
        return StockReservationJpaEntity.builder()
                .id(domain.getId())
                .orderId(domain.getOrderId())
                .productId(domain.getProductId())
                .quantity(domain.getQuantity())
                .status(domain.getStatus())
                .expiresAt(domain.getExpiresAt())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}
