package com.khandualoom.microservice.order.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.khandualoom.microservice.order.model.OrderStatus;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    @JsonProperty("status")
    @JsonAlias({"orderStatus", "newStatus"})
    private OrderStatus status;

    public OrderStatus getOrderStatus() {
        return status;
    }

    public void setOrderStatus(OrderStatus status) {
        this.status = status;
    }
}

