package com.khandualoom.microservice.inventory.infrastructure.persistence.repository;

import com.khandualoom.microservice.common.messaging.outbox.OutboxStatus;
import com.khandualoom.microservice.inventory.infrastructure.persistence.entity.InventoryOutboxJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryOutboxRepository extends JpaRepository<InventoryOutboxJpaEntity, UUID> {

    @Query(value = "SELECT * FROM outbox_events WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT :batchSize FOR UPDATE SKIP LOCKED", nativeQuery = true)
    List<InventoryOutboxJpaEntity> claimPendingBatch(@Param("batchSize") int batchSize);

    List<InventoryOutboxJpaEntity> findTop50ByStatusOrderByCreatedAtAsc(OutboxStatus status);
}
