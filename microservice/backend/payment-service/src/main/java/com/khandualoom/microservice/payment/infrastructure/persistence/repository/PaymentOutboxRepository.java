package com.khandualoom.microservice.payment.infrastructure.persistence.repository;

import com.khandualoom.microservice.common.messaging.outbox.OutboxStatus;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.PaymentOutboxJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentOutboxRepository extends JpaRepository<PaymentOutboxJpaEntity, UUID> {

    @Query(value = "SELECT * FROM outbox_events WHERE status = 'PENDING' OR (status = 'FAILED' AND (next_retry_at IS NULL OR next_retry_at <= CURRENT_TIMESTAMP) AND retry_count < :maxRetries) ORDER BY created_at ASC LIMIT :batchSize FOR UPDATE SKIP LOCKED", nativeQuery = true)
    List<PaymentOutboxJpaEntity> claimPendingBatch(@Param("batchSize") int batchSize, @Param("maxRetries") int maxRetries);

    default List<PaymentOutboxJpaEntity> claimPendingBatch(int batchSize) {
        return claimPendingBatch(batchSize, 5);
    }

    List<PaymentOutboxJpaEntity> findTop50ByStatusOrderByCreatedAtAsc(OutboxStatus status);
}
