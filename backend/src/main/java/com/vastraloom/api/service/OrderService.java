package com.vastraloom.api.service;

import com.vastraloom.api.dto.*;
import com.vastraloom.api.model.*;
import com.vastraloom.api.repository.AddressRepository;
import com.vastraloom.api.repository.OrderRepository;
import com.vastraloom.api.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;

    @Transactional
    @SuppressWarnings("null")
    public OrderResponse createOrder(User user, OrderRequest request) {
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (user.getAddresses().stream().noneMatch(a -> a.getId().equals(address.getId()))) {
            throw new RuntimeException("Address does not belong to user");
        }

        Order order = Order.builder()
                .user(user)
                .address(address)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .orderStatus(OrderStatus.PENDING)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = OrderItem.builder()
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .priceAtTime(BigDecimal.valueOf(product.getPrice()))
                    .build();

            order.addOrderItem(item);
            totalAmount = totalAmount.add(BigDecimal.valueOf(product.getPrice()).multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }

        order.setTotalAmount(totalAmount);
        
        // If COD, payment status stays PENDING until delivery.
        // For UPI/Card, only mark COMPLETED if Razorpay data is present (server-verified).
        if (request.getPaymentMethod() != PaymentMethod.COD) {
            if (request.getRazorpayOrderId() != null && request.getRazorpayPaymentId() != null
                    && request.getRazorpaySignature() != null) {
                order.setPaymentStatus(PaymentStatus.COMPLETED);
                order.setRazorpayOrderId(request.getRazorpayOrderId());
                order.setRazorpayPaymentId(request.getRazorpayPaymentId());
                order.setRazorpaySignature(request.getRazorpaySignature());
            } else {
                throw new RuntimeException("Payment verification data missing for online payment");
            }
        }

        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @SuppressWarnings("null")
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(status);
        if (status == OrderStatus.DELIVERED && order.getPaymentMethod() == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
        }
        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productCategory(item.getProduct().getCategory())
                        .productImageUrl(item.getProduct().getImages().isEmpty() ? null : item.getProduct().getImages().get(0))
                        .quantity(item.getQuantity())
                        .priceAtTime(item.getPriceAtTime())
                        .build())
                .collect(Collectors.toList());

        UserBasicInfo userInfo = UserBasicInfo.builder()
                .id(order.getUser().getId())
                .firstName(order.getUser().getFirstName())
                .lastName(order.getUser().getLastName())
                .email(order.getUser().getEmail())
                .phone(order.getUser().getPhone())
                .build();

        return OrderResponse.builder()
                .id(order.getId())
                .address(order.getAddress())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .user(userInfo)
                .build();
    }
}
