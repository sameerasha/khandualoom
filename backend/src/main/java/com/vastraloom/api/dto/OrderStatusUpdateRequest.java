package com.vastraloom.api.dto;

import com.vastraloom.api.model.OrderStatus;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    private OrderStatus status;
}
