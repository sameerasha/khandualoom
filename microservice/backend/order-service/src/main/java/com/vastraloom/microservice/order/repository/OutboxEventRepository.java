package com.vastraloom.microservice.order.repository;

import com.vastraloom.microservice.order.model.OutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, UUID> {
    List<OutboxEvent> findTop50ByProcessedFalseOrderByCreatedAtAsc();
}
