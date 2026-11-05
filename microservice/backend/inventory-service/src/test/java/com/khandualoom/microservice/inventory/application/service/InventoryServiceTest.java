package com.khandualoom.microservice.inventory.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.common.event.OrderItemEvent;
import com.khandualoom.microservice.inventory.domain.exception.SkuContentionException;
import com.khandualoom.microservice.inventory.domain.model.ReservationStatus;
import com.khandualoom.microservice.inventory.domain.model.StockReservation;
import com.khandualoom.microservice.inventory.domain.repository.InventoryRepository;
import com.khandualoom.microservice.inventory.domain.repository.ReservationRepository;
import com.khandualoom.microservice.inventory.infrastructure.concurrency.SkuAdmissionControl;
import com.khandualoom.microservice.inventory.infrastructure.persistence.repository.InventoryOutboxRepository;
import com.khandualoom.microservice.inventory.infrastructure.persistence.repository.SpringDataInventoryRepository;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private SpringDataInventoryRepository springDataInventoryRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private InventoryOutboxRepository outboxRepository;

    private SkuAdmissionControl skuAdmissionControl;
    private ObjectMapper objectMapper;
    private InventoryService inventoryService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper().findAndRegisterModules();
        skuAdmissionControl = new SkuAdmissionControl(50, new SimpleMeterRegistry());
        inventoryService = new InventoryService(
                inventoryRepository,
                springDataInventoryRepository,
                reservationRepository,
                outboxRepository,
                skuAdmissionControl,
                objectMapper
        );
    }

    @Test
    @DisplayName("Should successfully reserve all items and emit inventory.reserved outbox event")
    void shouldReserveAllItemsWhenStockAvailable() {
        Long orderId = 3001L;
        List<OrderItemEvent> items = List.of(
                new OrderItemEvent(101L, "Khandua Silk", 1, BigDecimal.valueOf(14999), "img.png"),
                new OrderItemEvent(102L, "Sambalpuri Cotton", 2, BigDecimal.valueOf(7999), "img2.png")
        );

        when(springDataInventoryRepository.atomicReserveStock(101L, 1)).thenReturn(1);
        when(springDataInventoryRepository.atomicReserveStock(102L, 2)).thenReturn(1);
        when(reservationRepository.save(any(StockReservation.class))).thenAnswer(i -> {
            StockReservation r = i.getArgument(0);
            return StockReservation.builder()
                    .id(UUID.randomUUID())
                    .orderId(r.getOrderId())
                    .productId(r.getProductId())
                    .quantity(r.getQuantity())
                    .status(ReservationStatus.RESERVED)
                    .build();
        });

        boolean result = inventoryService.processOrderReservation(orderId, items);

        assertThat(result).isTrue();
        verify(springDataInventoryRepository).atomicReserveStock(101L, 1);
        verify(springDataInventoryRepository).atomicReserveStock(102L, 2);
        verify(outboxRepository).save(argThat(outbox -> "inventory.reserved".equals(outbox.getEventType())));
    }

    @Test
    @DisplayName("Should roll back partial reservations and emit failure outbox when stock is insufficient")
    void shouldRollbackPartialAndEmitFailureOutboxWhenStockInsufficient() {
        Long orderId = 3002L;
        List<OrderItemEvent> items = List.of(
                new OrderItemEvent(101L, "Khandua Silk", 1, BigDecimal.valueOf(14999), "img.png"),
                new OrderItemEvent(102L, "Out of Stock Saree", 1, BigDecimal.valueOf(7999), "img2.png")
        );

        UUID res1Id = UUID.randomUUID();
        when(springDataInventoryRepository.atomicReserveStock(101L, 1)).thenReturn(1);
        when(springDataInventoryRepository.atomicReserveStock(102L, 1)).thenReturn(0); // Item 2 fails!
        when(reservationRepository.save(any(StockReservation.class))).thenReturn(
                StockReservation.builder().id(res1Id).orderId(orderId).productId(101L).quantity(1).status(ReservationStatus.RESERVED).build()
        );

        boolean result = inventoryService.processOrderReservation(orderId, items);

        assertThat(result).isFalse();
        // Item 1 must be compensated/released
        verify(springDataInventoryRepository).atomicReleaseStock(101L, 1);
        verify(reservationRepository).atomicTransitionStatus(res1Id, ReservationStatus.RESERVED, ReservationStatus.RELEASED);
        // Failure outbox event MUST be saved
        verify(outboxRepository).save(argThat(outbox -> "inventory.reservation-failed".equals(outbox.getEventType())));
    }

    @Test
    @DisplayName("Should fulfill reservation only if atomic transition to CONSUMED succeeds")
    void shouldFulfillReservationAtomically() {
        Long orderId = 3003L;
        UUID resId = UUID.randomUUID();
        StockReservation res = StockReservation.builder()
                .id(resId)
                .orderId(orderId)
                .productId(101L)
                .quantity(1)
                .status(ReservationStatus.RESERVED)
                .build();

        when(reservationRepository.findByOrderId(orderId)).thenReturn(List.of(res));
        when(reservationRepository.atomicTransitionStatus(resId, ReservationStatus.RESERVED, ReservationStatus.CONSUMED)).thenReturn(1);

        inventoryService.fulfillReservation(orderId);

        verify(springDataInventoryRepository).atomicFulfillStock(101L, 1);
    }

    @Test
    @DisplayName("Single reservation should reject fast with SkuContentionException when admission control is saturated")
    void shouldRejectWhenAdmissionControlIsSaturated() {
        Long productId = 999L;
        SkuAdmissionControl tightAdmission = new SkuAdmissionControl(1, new SimpleMeterRegistry());
        InventoryService tightService = new InventoryService(
                inventoryRepository,
                springDataInventoryRepository,
                reservationRepository,
                outboxRepository,
                tightAdmission,
                objectMapper
        );

        // Saturate the single permit
        tightAdmission.tryAcquire(productId, java.time.Duration.ofMillis(100));

        assertThatThrownBy(() -> tightService.reserveStock(4001L, productId, 1))
                .isInstanceOf(SkuContentionException.class)
                .hasMessageContaining("High concurrency contention for product #999");
    }
}
