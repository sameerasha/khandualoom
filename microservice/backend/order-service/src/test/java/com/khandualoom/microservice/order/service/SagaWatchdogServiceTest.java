package com.khandualoom.microservice.order.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.order.model.*;
import com.khandualoom.microservice.order.repository.OrderRepository;
import com.khandualoom.microservice.order.repository.OutboxEventRepository;
import com.khandualoom.microservice.order.repository.SagaInstanceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
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

    @BeforeEach
    void setUp() {
        watchdogService = new SagaWatchdogService(
                sagaInstanceRepository,
                orderRepository,
                outboxEventRepository,
                objectMapper
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
    }
}
