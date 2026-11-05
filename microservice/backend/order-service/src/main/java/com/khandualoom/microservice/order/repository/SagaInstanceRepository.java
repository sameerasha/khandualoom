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

    @Query("SELECT s FROM SagaInstance s WHERE s.sagaStatus IN (com.khandualoom.microservice.order.model.SagaStatus.STARTED, com.khandualoom.microservice.order.model.SagaStatus.IN_PROGRESS) AND s.deadlineAt < :now")
    List<SagaInstance> findOverdueSagas(@Param("now") Instant now);
}
