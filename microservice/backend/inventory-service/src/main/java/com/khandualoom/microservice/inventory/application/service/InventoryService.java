package com.khandualoom.microservice.inventory.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.common.exception.ResourceNotFoundException;
import com.khandualoom.microservice.contract.event.InventoryReservationFailedEvent;
import com.khandualoom.microservice.contract.event.InventoryReservedEvent;
import com.khandualoom.microservice.inventory.application.dto.StockAdjustmentRequest;
import com.khandualoom.microservice.inventory.application.dto.StockCheckResponse;
import com.khandualoom.microservice.inventory.application.dto.StockReservationDto;
import com.khandualoom.microservice.inventory.domain.exception.InsufficientStockException;
import com.khandualoom.microservice.inventory.domain.model.InventoryItem;
import com.khandualoom.microservice.inventory.domain.model.ReservationStatus;
import com.khandualoom.microservice.inventory.domain.model.StockReservation;
import com.khandualoom.microservice.inventory.domain.repository.InventoryRepository;
import com.khandualoom.microservice.inventory.domain.repository.ReservationRepository;
import com.khandualoom.microservice.inventory.infrastructure.persistence.entity.InventoryOutboxJpaEntity;
import com.khandualoom.microservice.inventory.infrastructure.persistence.repository.InventoryOutboxRepository;
import com.khandualoom.microservice.inventory.infrastructure.persistence.repository.SpringDataInventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final SpringDataInventoryRepository springDataInventoryRepository;
    private final ReservationRepository reservationRepository;
    private final InventoryOutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public StockCheckResponse checkStock(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .map(item -> new StockCheckResponse(productId, item.getAvailableStock(), item.getAvailableStock() > 0))
                .orElse(new StockCheckResponse(productId, 0, false));
    }

    @Transactional(readOnly = true)
    public List<StockCheckResponse> checkStockBatch(List<Long> productIds) {
        return inventoryRepository.findByProductIdIn(productIds).stream()
                .map(item -> new StockCheckResponse(item.getProductId(), item.getAvailableStock(), item.getAvailableStock() > 0))
                .toList();
    }

    /**
     * Atomically reserves stock using conditional SQL updates to prevent overselling under high concurrency.
     * Persists integration events to the Transactional Outbox within the same database transaction.
     */
    @Transactional
    public StockReservationDto reserveStock(Long orderId, Long productId, int quantity) {
        log.info("Attempting atomic reservation: orderId={}, productId={}, quantity={}", orderId, productId, quantity);

        // 1. Idempotency Check: Prevent duplicate reservation for the same order and product
        Optional<StockReservation> existing = reservationRepository.findByOrderIdAndProductId(orderId, productId);
        if (existing.isPresent()) {
            StockReservation res = existing.get();
            if (res.getStatus() == ReservationStatus.RESERVED) {
                log.info("Idempotent replay: reservation already exists for order #{} and product #{}", orderId, productId);
                return toDto(res);
            }
        }

        // 2. Atomic Conditional Database Update
        int updatedRows = springDataInventoryRepository.atomicReserveStock(productId, quantity);

        if (updatedRows == 0) {
            log.warn("Atomic reservation failed: Insufficient stock for product #{}", productId);
            saveOutboxEvent("inventory.reservation-failed", String.valueOf(orderId),
                    InventoryReservationFailedEvent.of(orderId, "Insufficient stock available for product: " + productId));
            throw new InsufficientStockException("Insufficient stock available for product: " + productId);
        }

        // 3. Persist Reservation Record
        StockReservation reservation = StockReservation.create(orderId, productId, quantity, 900); // 15-min TTL
        StockReservation savedReservation = reservationRepository.save(reservation);

        // 4. Record Event in Transactional Outbox (Same DB transaction)
        saveOutboxEvent("inventory.reserved", String.valueOf(orderId),
                InventoryReservedEvent.of(orderId, savedReservation.getId()));

        log.info("Stock atomically reserved: reservationId={}, orderId={}, productId={}",
                savedReservation.getId(), orderId, productId);
        return toDto(savedReservation);
    }

    /**
     * Safe stock compensation: Releases stock back into available pool when a checkout fails or is cancelled.
     */
    @Transactional
    public void releaseReservation(Long orderId) {
        log.info("Executing inventory compensation for cancelled order: {}", orderId);
        List<StockReservation> reservations = reservationRepository.findByOrderId(orderId);
        for (StockReservation res : reservations) {
            if (res.getStatus() == ReservationStatus.RESERVED) {
                springDataInventoryRepository.atomicReleaseStock(res.getProductId(), res.getQuantity());
                res.markReleased();
                reservationRepository.save(res);
                log.info("Released {} units of product #{} for order #{}", res.getQuantity(), res.getProductId(), orderId);
            }
        }
    }

    /**
     * Fulfills reservation when payment succeeds and order is confirmed.
     */
    @Transactional
    public void fulfillReservation(Long orderId) {
        log.info("Fulfilling reservation for confirmed order: {}", orderId);
        List<StockReservation> reservations = reservationRepository.findByOrderId(orderId);
        for (StockReservation res : reservations) {
            if (res.getStatus() == ReservationStatus.RESERVED) {
                springDataInventoryRepository.atomicFulfillStock(res.getProductId(), res.getQuantity());
                res.markConsumed();
                reservationRepository.save(res);
                log.info("Fulfilled {} units of product #{} for confirmed order #{}", res.getQuantity(), res.getProductId(), orderId);
            }
        }
    }

    /**
     * Periodic watchdog sweep: Automatically releases expired 15-minute stock reservations.
     */
    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void cleanupExpiredReservations() {
        Instant now = Instant.now();
        List<StockReservation> expired = reservationRepository.findExpiredReservations(now);
        if (!expired.isEmpty()) {
            log.info("Found {} expired stock reservations to release", expired.size());
            for (StockReservation res : expired) {
                springDataInventoryRepository.atomicReleaseStock(res.getProductId(), res.getQuantity());
                res.markExpired();
                reservationRepository.save(res);
                log.warn("Expired reservation #{} for product #{} auto-released back to available stock",
                        res.getId(), res.getProductId());
            }
        }
    }

    @Transactional
    public StockCheckResponse adjustStock(StockAdjustmentRequest request) {
        InventoryItem item = inventoryRepository.findByProductId(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found for product: " + request.getProductId()));
        item.adjustStock(request.getDelta());
        InventoryItem saved = inventoryRepository.save(item);
        return new StockCheckResponse(saved.getProductId(), saved.getAvailableStock(), saved.getAvailableStock() > 0);
    }

    private void saveOutboxEvent(String eventType, String aggregateId, Object payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            InventoryOutboxJpaEntity outbox = new InventoryOutboxJpaEntity("Inventory", aggregateId, eventType, json);
            outboxRepository.save(outbox);
        } catch (Exception e) {
            log.error("Failed to serialize outbox event for {}: {}", eventType, e.getMessage());
        }
    }

    private StockReservationDto toDto(StockReservation domain) {
        return StockReservationDto.builder()
                .reservationId(domain.getId())
                .orderId(domain.getOrderId())
                .productId(domain.getProductId())
                .quantity(domain.getQuantity())
                .status(domain.getStatus().name())
                .build();
    }
}
