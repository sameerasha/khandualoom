package com.khandualoom.microservice.order.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.common.event.OrderCreatedEvent;
import com.khandualoom.microservice.common.event.OrderItemEvent;
import com.khandualoom.microservice.common.exception.ResourceNotFoundException;
import com.khandualoom.microservice.order.dto.*;
import com.khandualoom.microservice.order.model.*;
import com.khandualoom.microservice.order.repository.OrderRepository;
import com.khandualoom.microservice.order.repository.OutboxEventRepository;
import com.khandualoom.microservice.order.repository.SagaInstanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final SagaInstanceRepository sagaInstanceRepository;
    private final ObjectMapper objectMapper;
    private final OrderMetricsService orderMetricsService;

    @Transactional
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        long startTime = System.currentTimeMillis();
        Order order = Order.builder()
                .userId(userId)
                .customerName(request.getCustomerName() != null ? request.getCustomerName() : "Customer")
                .customerEmail(request.getCustomerEmail() != null ? request.getCustomerEmail() : "guest@khandualoom.com")
                .customerPhone(request.getCustomerPhone() != null ? request.getCustomerPhone() : "")
                .shippingAddress(request.getShippingAddress() != null ? request.getShippingAddress() : "Default Address")
                .city(request.getCity() != null ? request.getCity() : "City")
                .state(request.getState() != null ? request.getState() : "State")
                .pincode(request.getPincode() != null ? request.getPincode() : "000000")
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.COD)
                .paymentStatus(PaymentStatus.PENDING)
                .orderStatus(OrderStatus.PENDING)
                .razorpayOrderId(request.getRazorpayOrderId())
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .razorpaySignature(request.getRazorpaySignature())
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItemEvent> eventItems = new ArrayList<>();

        if (request.getItems() != null) {
            for (OrderItemRequest itemReq : request.getItems()) {
                BigDecimal itemPrice = itemReq.getPrice() != null ? itemReq.getPrice() : BigDecimal.valueOf(14999);
                int qty = itemReq.getQuantity() != null && itemReq.getQuantity() > 0 ? itemReq.getQuantity() : 1;

                OrderItem item = OrderItem.builder()
                        .productId(itemReq.getProductId())
                        .productName(itemReq.getProductName() != null ? itemReq.getProductName() : "Handloom Saree")
                        .productImage(itemReq.getProductImage())
                        .quantity(qty)
                        .price(itemPrice)
                        .build();

                order.addOrderItem(item);
                total = total.add(itemPrice.multiply(BigDecimal.valueOf(qty)));

                eventItems.add(new OrderItemEvent(
                        itemReq.getProductId(),
                        item.getProductName(),
                        qty,
                        itemPrice,
                        item.getProductImage()
                ));
            }
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);

        // Persistent Saga State Machine Initialization (15-min timeout)
        SagaInstance saga = SagaInstance.start(savedOrder.getId(), 900);
        sagaInstanceRepository.save(saga);

        // Transactional Outbox Pattern: Save OrderCreatedEvent within same ACID transaction
        try {
            OrderCreatedEvent event = OrderCreatedEvent.create(
                    savedOrder.getId(),
                    savedOrder.getUserId(),
                    savedOrder.getCustomerEmail(),
                    savedOrder.getCustomerPhone(),
                    savedOrder.getTotalAmount(),
                    savedOrder.getShippingAddress(),
                    savedOrder.getCity(),
                    savedOrder.getState(),
                    savedOrder.getPincode(),
                    eventItems
            );

            OutboxEvent outboxEvent = new OutboxEvent(
                    "Order",
                    savedOrder.getId().toString(),
                    "OrderCreatedEvent",
                    objectMapper.writeValueAsString(event)
            );

            outboxEventRepository.save(outboxEvent);
            log.info("Persisted OutboxEvent and initialized Saga for Order #{}", savedOrder.getId());
        } catch (Exception e) {
            log.error("Failed to serialize Outbox event: {}", e.getMessage(), e);
        }

        // Record Observability Metrics (Prometheus / Grafana)
        orderMetricsService.recordOrderCreated(savedOrder.getTotalAmount());
        orderMetricsService.recordOrderDuration(System.currentTimeMillis() - startTime);

        return mapToResponse(savedOrder);
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return mapToResponse(order);
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedDateDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedDateDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        order.setOrderStatus(request.getOrderStatus());
        return mapToResponse(orderRepository.save(order));
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(i -> OrderItemResponse.builder()
                        .id(i.getId())
                        .productId(i.getProductId())
                        .productName(i.getProductName())
                        .productImage(i.getProductImage())
                        .quantity(i.getQuantity())
                        .price(i.getPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .customerName(order.getCustomerName())
                .customerEmail(order.getCustomerEmail())
                .customerPhone(order.getCustomerPhone())
                .shippingAddress(order.getShippingAddress())
                .city(order.getCity())
                .state(order.getState())
                .pincode(order.getPincode())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .razorpayOrderId(order.getRazorpayOrderId())
                .razorpayPaymentId(order.getRazorpayPaymentId())
                .createdDate(order.getCreatedDate())
                .items(itemResponses)
                .build();
    }
}
