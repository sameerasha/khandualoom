package com.khandualoom.microservice.inventory.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.common.event.OrderItemEvent;
import com.khandualoom.microservice.common.exception.ResourceNotFoundException;
import com.khandualoom.microservice.contract.event.InventoryReservationFailedEvent;
import com.khandualoom.microservice.contract.event.InventoryReservedEvent;
import com.khandualoom.microservice.inventory.application.dto.StockAdjustmentRequest;
import com.khandualoom.microservice.inventory.application.dto.StockCheckResponse;
import com.khandualoom.microservice.inventory.application.dto.StockReservationDto;
import com.khandualoom.microservice.inventory.domain.exception.InsufficientStockException;
import com.khandualoom.microservice.inventory.domain.exception.SkuContentionException;
import com.khandualoom.microservice.inventory.domain.model.InventoryItem;
import com.khandualoom.microservice.inventory.domain.model.ReservationStatus;
import com.khandualoom.microservice.inventory.domain.model.StockReservation;
import com.khandualoom.microservice.inventory.domain.repository.InventoryRepository;
import com.khandualoom.microservice.inventory.domain.repository.ReservationRepository;
import com.khandualoom.microservice.inventory.infrastructure.concurrency.SkuAdmissionControl;
import com.khandualoom.microservice.inventory.infrastructure.persistence.entity.InventoryOutboxJpaEntity;
import com.khandualoom.microservice.inventory.infrastructure.persistence.repository.InventoryOutboxRepository;
import com.khandualoom.microservice.inventory.infrastructure.persistence.repository.SpringDataInventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
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
    private final SkuAdmissionControl skuAdmissionControl;
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
     * Atomically reserves all items for an incoming order.
     * If any item is out of stock, partially reserved items are rolled back and an
     * inventory.reservation-failed outbox event is saved and committed cleanly.
     */
    @Transactional
    public boolean processOrderReservation(Long orderId, List<OrderItemEvent> items) {
        log.info("Processing order inventory reservation: orderId={}, itemsCount={}",
                orderId, items != null ? items.size() : 0);

        if (items == null || items.isEmpty()) {
            return true;
        }

        // Idempotency check: if all items already active
        List<StockReservation> existingList = reservationRepository.findByOrderId(orderId);
        if (!existingList.isEmpty() && existingList.stream().allMatch(r -> r.getStatus() == ReservationStatus.RESERVED)) {
            log.info("Idempotent replay: all reservations already active for order #{}", orderId);
            return true;
        }

        List<StockReservation> successfullyReserved = new ArrayList<>();
        List<Long> acquiredPermitSkus = new ArrayList<>();
        boolean allReserved = true;

        try {
            // SkuAdmissionControl: Acquire permits across all ordered SKUs to prevent connection starvation
            for (OrderItemEvent item : items) {
                if (!skuAdmissionControl.tryAcquire(item.productId(), java.time.Duration.ofMillis(300))) {
                    log.warn("SKU admission rejected product #{} under high concurrency contention for order #{}",
                            item.productId(), orderId);
                    allReserved = false;
                    break;
                }
                acquiredPermitSkus.add(item.productId());
            }

            if (!allReserved) {
                saveOutboxEvent("inventory.reservation-failed", String.valueOf(orderId),
                        InventoryReservationFailedEvent.of(orderId, "High flash-sale contention for requested items"));
                return false;
            }

            for (OrderItemEvent item : items) {
                int updated = springDataInventoryRepository.atomicReserveStock(item.productId(), item.quantity());
                if (updated > 0) {
                    StockReservation res = StockReservation.create(orderId, item.productId(), item.quantity(), 900);
                    successfullyReserved.add(reservationRepository.save(res));
                } else {
                    log.warn("Insufficient stock for product #{} during reservation for order #{}", item.productId(), orderId);
                    allReserved = false;
                    break;
                }
            }

            if (!allReserved) {
                // Revert partial reservations within this order
                for (StockReservation res : successfullyReserved) {
                    springDataInventoryRepository.atomicReleaseStock(res.getProductId(), res.getQuantity());
                    reservationRepository.atomicTransitionStatus(res.getId(), ReservationStatus.RESERVED, ReservationStatus.RELEASED);
                }

                // Save failure outbox event cleanly so it COMMITS and publishes
                saveOutboxEvent("inventory.reservation-failed", String.valueOf(orderId),
                        InventoryReservationFailedEvent.of(orderId, "Insufficient stock available for requested items"));
                log.info("Committed inventory.reservation-failed outbox event for order #{}", orderId);
                return false;
            }

            // All succeeded: emit inventory.reserved
            StockReservation firstRes = successfullyReserved.get(0);
            saveOutboxEvent("inventory.reserved", String.valueOf(orderId),
                    InventoryReservedEvent.of(orderId, firstRes.getId()));
            log.info("All {} items successfully reserved for order #{}. Emitted inventory.reserved.", items.size(), orderId);
            return true;
        } finally {
            for (Long sku : acquiredPermitSkus) {
                skuAdmissionControl.release(sku);
            }
        }
    }

    /**
     * Atomically reserves stock for a single item.
     */
    @Transactional
    public StockReservationDto reserveStock(Long orderId, Long productId, int quantity) {
        log.info("Attempting single atomic reservation: orderId={}, productId={}, quantity={}", orderId, productId, quantity);

        if (!skuAdmissionControl.tryAcquire(productId, java.time.Duration.ofMillis(200))) {
            throw new SkuContentionException("High concurrency contention for product #" + productId + ". Please retry shortly.");
        }

        try {
            Optional<StockReservation> existing = reservationRepository.findByOrderIdAndProductId(orderId, productId);
            if (existing.isPresent()) {
                StockReservation res = existing.get();
                if (res.getStatus() == ReservationStatus.RESERVED) {
                    log.info("Idempotent replay: reservation already exists for order #{} and product #{}", orderId, productId);
                    return toDto(res);
                }
            }

            int updatedRows = springDataInventoryRepository.atomicReserveStock(productId, quantity);

            if (updatedRows == 0) {
                log.warn("Atomic reservation failed: Insufficient stock for product #{}", productId);
                saveOutboxEvent("inventory.reservation-failed", String.valueOf(orderId),
                        InventoryReservationFailedEvent.of(orderId, "Insufficient stock available for product: " + productId));
                throw new InsufficientStockException("Insufficient stock available for product: " + productId);
            }

            StockReservation reservation = StockReservation.create(orderId, productId, quantity, 900);
            StockReservation savedReservation = reservationRepository.save(reservation);

            saveOutboxEvent("inventory.reserved", String.valueOf(orderId),
                    InventoryReservedEvent.of(orderId, savedReservation.getId()));

            return toDto(savedReservation);
        } finally {
            skuAdmissionControl.release(productId);
        }
    }

    /**
     * Safe stock compensation: Releases stock back into available pool when a checkout fails or is cancelled.
     * Uses atomic status transition to guarantee mutual exclusion.
     */
    @Transactional
    public void releaseReservation(Long orderId) {
        log.info("Executing inventory compensation for cancelled order: {}", orderId);
        List<StockReservation> reservations = reservationRepository.findByOrderId(orderId);
        for (StockReservation res : reservations) {
            int updated = reservationRepository.atomicTransitionStatus(res.getId(), ReservationStatus.RESERVED, ReservationStatus.RELEASED);
            if (updated > 0) {
                springDataInventoryRepository.atomicReleaseStock(res.getProductId(), res.getQuantity());
                log.info("Exclusively released {} units of product #{} for order #{}", res.getQuantity(), res.getProductId(), orderId);
            }
        }
    }

    /**
     * Fulfills reservation when payment succeeds and order is confirmed.
     * Uses atomic status transition to guarantee mutual exclusion.
     */
    @Transactional
    public void fulfillReservation(Long orderId) {
        log.info("Fulfilling reservation for confirmed order: {}", orderId);
        List<StockReservation> reservations = reservationRepository.findByOrderId(orderId);
        for (StockReservation res : reservations) {
            int updated = reservationRepository.atomicTransitionStatus(res.getId(), ReservationStatus.RESERVED, ReservationStatus.CONSUMED);
            if (updated > 0) {
                springDataInventoryRepository.atomicFulfillStock(res.getProductId(), res.getQuantity());
                log.info("Exclusively fulfilled {} units of product #{} for confirmed order #{}", res.getQuantity(), res.getProductId(), orderId);
            }
        }
    }

    /**
     * Periodic watchdog sweep: Automatically releases expired 15-minute stock reservations.
     * Uses atomic status transition to prevent double release against concurrent fulfillment.
     */
    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void cleanupExpiredReservations() {
        Instant now = Instant.now();
        List<StockReservation> expired = reservationRepository.findExpiredReservations(now);
        if (!expired.isEmpty()) {
            log.info("Found {} expired stock reservations to release", expired.size());
            for (StockReservation res : expired) {
                int updated = reservationRepository.atomicTransitionStatus(res.getId(), ReservationStatus.RESERVED, ReservationStatus.EXPIRED);
                if (updated > 0) {
                    springDataInventoryRepository.atomicReleaseStock(res.getProductId(), res.getQuantity());
                    log.warn("Exclusively expired reservation #{} for product #{} auto-released to available stock",
                            res.getId(), res.getProductId());
                }
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
