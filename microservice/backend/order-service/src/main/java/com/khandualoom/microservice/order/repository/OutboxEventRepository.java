package com.khandualoom.microservice.order.repository;

import com.khandualoom.microservice.common.messaging.outbox.OutboxStatus;
import com.khandualoom.microservice.order.model.OutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, UUID> {

    @Query(value = "SELECT * FROM outbox_events WHERE (status = 'PENDING' OR (status = 'FAILED' AND (next_retry_at IS NULL OR next_retry_at <= CURRENT_TIMESTAMP) AND retry_count < :maxRetries)) AND (locked_until IS NULL OR locked_until <= CURRENT_TIMESTAMP) ORDER BY created_at ASC LIMIT :batchSize FOR UPDATE SKIP LOCKED", nativeQuery = true)
    List<OutboxEvent> claimPendingBatch(@Param("batchSize") int batchSize, @Param("maxRetries") int maxRetries);

    default List<OutboxEvent> claimPendingBatch(int batchSize) {
        return claimPendingBatch(batchSize, 5);
    }

    List<OutboxEvent> findTop50ByStatusOrderByCreatedAtAsc(OutboxStatus status);

    @Modifying
    @Query(value = "DELETE FROM outbox_events WHERE status = 'PUBLISHED' AND published_at < :retentionCutoff", nativeQuery = true)
    int purgePublishedEvents(@Param("retentionCutoff") Instant retentionCutoff);

    @Query(value = "SELECT COUNT(*) FROM outbox_events WHERE status IN ('PENDING', 'FAILED')", nativeQuery = true)
    long countPendingBacklog();

    @Query(value = "SELECT MIN(created_at) FROM outbox_events WHERE status IN ('PENDING', 'FAILED')", nativeQuery = true)
    Instant findOldestUnpublishedCreatedAt();
}
