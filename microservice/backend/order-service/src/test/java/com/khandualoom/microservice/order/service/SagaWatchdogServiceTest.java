package com.khandualoom.microservice.order.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.order.model.*;
import com.khandualoom.microservice.order.repository.OrderRepository;
import com.khandualoom.microservice.order.repository.OutboxEventRepository;
import com.khandualoom.microservice.order.repository.SagaInstanceRepository;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.OptimisticLockingFailureException;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SagaWatchdogServiceTest {

    @Mock
    private SagaInstanceRepository sagaInstanceRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OutboxEventRepository outboxEventRepository;

    private SagaWatchdogService watchdogService;
    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
    private final SimpleMeterRegistry meterRegistry = new SimpleMeterRegistry();

    @BeforeEach
    void setUp() {
        watchdogService = new SagaWatchdogService(
                sagaInstanceRepository,
                orderRepository,
                outboxEventRepository,
                objectMapper,
                Optional.of(meterRegistry)
        );
    }

    @Test
    @DisplayName("Should recover overdue Saga: cancel timed-out order and emit inventory release compensation")
    void shouldRecoverOverdueSagaAndReleaseInventory() {
        Long orderId = 3001L;
        Instant past = Instant.now().minusSeconds(1200);

        SagaInstance overdueSaga = SagaInstance.builder()
                .sagaId(UUID.randomUUID())
                .orderId(orderId)
                .currentStep(SagaStep.PAYMENT_PROCESSING)
                .sagaStatus(SagaStatus.IN_PROGRESS)
                .stepStartedAt(past)
                .deadlineAt(past.plusSeconds(900))
                .compensationStatus("NONE")
                .version(1L)
                .build();

        Order order = Order.builder()
                .id(orderId)
                .orderStatus(OrderStatus.PAYMENT_PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .totalAmount(new BigDecimal("12000.00"))
                .build();

        when(sagaInstanceRepository.findOverdueSagas(any(Instant.class))).thenReturn(List.of(overdueSaga));
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        watchdogService.recoverOverdueSagas();

        // 1. Verify order was marked CANCELLED
        assertThat(order.getOrderStatus()).isEqualTo(OrderStatus.CANCELLED);
        assertThat(order.getPaymentStatus()).isEqualTo(PaymentStatus.FAILED);
        verify(orderRepository).save(order);

        // 2. Verify saga compensation triggered
        assertThat(overdueSaga.getCurrentStep()).isEqualTo(SagaStep.CANCELLED);
        assertThat(overdueSaga.getSagaStatus()).isEqualTo(SagaStatus.COMPENSATED);
        assertThat(overdueSaga.getCompensationStatus()).isEqualTo("COMPLETED");
        verify(sagaInstanceRepository).save(overdueSaga);

        // 3. Verify compensation event published to Outbox
        ArgumentCaptor<OutboxEvent> outboxCaptor = ArgumentCaptor.forClass(OutboxEvent.class);
        verify(outboxEventRepository).save(outboxCaptor.capture());
        OutboxEvent outbox = outboxCaptor.getValue();
        assertThat(outbox.getEventType()).isEqualTo("inventory.release-reservation");
        assertThat(outbox.getAggregateId()).isEqualTo(orderId.toString());

        // 4. Verify metric incremented
        assertThat(meterRegistry.counter("khandualoom_saga_watchdog_recoveries").count()).isEqualTo(1.0);
    }

    @Test
    @DisplayName("Should safely handle OptimisticLockingFailureException when concurrent payment modifies Order")
    void shouldCatchOptimisticLockingFailureAndContinue() {
        Long orderId = 3002L;
        Instant past = Instant.now().minusSeconds(1200);

        SagaInstance overdueSaga = SagaInstance.builder()
                .sagaId(UUID.randomUUID())
                .orderId(orderId)
                .currentStep(SagaStep.PAYMENT_PROCESSING)
                .sagaStatus(SagaStatus.IN_PROGRESS)
                .stepStartedAt(past)
                .deadlineAt(past.plusSeconds(900))
                .version(1L)
                .build();

        Order order = Order.builder()
                .id(orderId)
                .orderStatus(OrderStatus.PAYMENT_PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .totalAmount(new BigDecimal("5000.00"))
                .build();

        when(sagaInstanceRepository.findOverdueSagas(any(Instant.class))).thenReturn(List.of(overdueSaga));
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenThrow(new OptimisticLockingFailureException("Row updated concurrently by payment webhook"));

        assertDoesNotThrow(() -> watchdogService.recoverOverdueSagas());
        verify(outboxEventRepository, never()).save(any());
    }
}
