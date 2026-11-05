package com.khandualoom.microservice.audit.domain.repository;

import com.khandualoom.microservice.audit.domain.model.AuditEvent;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AuditRepository {
    AuditEvent save(AuditEvent event);
    Optional<AuditEvent> findById(UUID id);
    List<AuditEvent> findByAggregate(String aggregateType, String aggregateId);
    List<AuditEvent> findRecent(int limit);
}
