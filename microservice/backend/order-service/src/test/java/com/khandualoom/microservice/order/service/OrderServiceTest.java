package com.khandualoom.microservice.order.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.order.dto.OrderItemRequest;
import com.khandualoom.microservice.order.dto.OrderRequest;
import com.khandualoom.microservice.order.dto.OrderResponse;
import com.khandualoom.microservice.order.model.Order;
import com.khandualoom.microservice.order.model.OrderStatus;
import com.khandualoom.microservice.order.model.PaymentMethod;
import com.khandualoom.microservice.order.model.PaymentStatus;
import com.khandualoom.microservice.order.repository.OrderRepository;
import com.khandualoom.microservice.order.repository.OutboxEventRepository;
import com.khandualoom.microservice.order.repository.SagaInstanceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OutboxEventRepository outboxEventRepository;

    @Mock
    private SagaInstanceRepository sagaInstanceRepository;

    @Mock
    private OrderMetricsService orderMetricsService;

    private ObjectMapper objectMapper;
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper().findAndRegisterModules();
        orderService = new OrderService(
                orderRepository,
                outboxEventRepository,
                sagaInstanceRepository,
                objectMapper,
                orderMetricsService
        );
    }

    @Test
    @DisplayName("Should create new order and persist outbox event and saga when idempotency key is fresh")
    void shouldCreateOrderWhenIdempotencyKeyIsFresh() {
        String key = "test-idemp-key-1001";
        OrderRequest request = new OrderRequest();
        request.setCustomerName("Asha Buyer");
        request.setCustomerEmail("buyer@khandualoom.com");
        request.setCustomerPhone("+919876543210");
        request.setShippingAddress("Bhubaneswar, Odisha");
        request.setCity("Bhubaneswar");
        request.setState("Odisha");
        request.setPincode("751001");
        request.setPaymentMethod(PaymentMethod.UPI);

        OrderItemRequest item = new OrderItemRequest();
        item.setProductId(101L);
        item.setProductName("Khandua Pata");
        item.setQuantity(1);
        item.setPrice(BigDecimal.valueOf(14999));
        request.setItems(List.of(item));

        when(orderRepository.findByIdempotencyKey(key)).thenReturn(Optional.empty());
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(5001L);
            return o;
        });

        OrderResponse response = orderService.createOrder(1L, request, key);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(5001L);
        verify(orderRepository).save(any(Order.class));
        verify(sagaInstanceRepository).save(any());
        verify(outboxEventRepository).save(any());
    }

    @Test
    @DisplayName("Should return existing order without duplicate save when idempotency key matches")
    void shouldReturnExistingOrderOnDuplicateIdempotencyKey() {
        String key = "test-duplicate-key-999";
        Order existingOrder = Order.builder()
                .id(999L)
                .userId(1L)
                .idempotencyKey(key)
                .customerName("Existing Customer")
                .customerEmail("existing@khandualoom.com")
                .totalAmount(BigDecimal.valueOf(14999))
                .orderStatus(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        when(orderRepository.findByIdempotencyKey(key)).thenReturn(Optional.of(existingOrder));

        OrderRequest request = new OrderRequest();
        OrderResponse response = orderService.createOrder(1L, request, key);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(999L);
        // Verify order repository save was never called again (idempotent replay)
        verify(orderRepository, never()).save(any(Order.class));
        verify(sagaInstanceRepository, never()).save(any());
        verify(outboxEventRepository, never()).save(any());
    }
}
