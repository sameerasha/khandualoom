package com.khandualoom.microservice.order.repository;

import com.khandualoom.microservice.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedDateDesc(Long userId);
    List<Order> findAllByOrderByCreatedDateDesc();
}
