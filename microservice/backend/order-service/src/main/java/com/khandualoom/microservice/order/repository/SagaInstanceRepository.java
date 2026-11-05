package com.khandualoom.microservice.order.repository;

import com.khandualoom.microservice.order.model.SagaInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SagaInstanceRepository extends JpaRepository<SagaInstance, UUID> {

    Optional<SagaInstance> findByOrderId(Long orderId);

    @Query(value = "SELECT * FROM saga_instances WHERE saga_status IN ('STARTED', 'IN_PROGRESS') AND deadline_at < :now ORDER BY deadline_at ASC LIMIT 50 FOR UPDATE SKIP LOCKED", nativeQuery = true)
    List<SagaInstance> findOverdueSagas(@Param("now") Instant now);
}
