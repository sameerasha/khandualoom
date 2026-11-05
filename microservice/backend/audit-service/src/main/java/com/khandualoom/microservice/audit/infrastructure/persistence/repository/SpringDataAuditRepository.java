package com.khandualoom.microservice.audit.infrastructure.persistence.repository;

import com.khandualoom.microservice.audit.infrastructure.persistence.entity.AuditEventJpaEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SpringDataAuditRepository extends JpaRepository<AuditEventJpaEntity, UUID> {

    List<AuditEventJpaEntity> findByAggregateTypeAndAggregateIdOrderByTimestampDesc(String aggregateType, String aggregateId);

    @Query("SELECT a FROM AuditEventJpaEntity a ORDER BY a.timestamp DESC")
    List<AuditEventJpaEntity> findRecentEvents(Pageable pageable);
}
