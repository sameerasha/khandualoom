package com.khandualoom.microservice.audit.infrastructure.persistence.adapter;

import com.khandualoom.microservice.audit.domain.model.AuditEvent;
import com.khandualoom.microservice.audit.domain.repository.AuditRepository;
import com.khandualoom.microservice.audit.infrastructure.persistence.entity.AuditEventJpaEntity;
import com.khandualoom.microservice.audit.infrastructure.persistence.repository.SpringDataAuditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AuditPersistenceAdapter implements AuditRepository {

    private final SpringDataAuditRepository repository;

    @Override
    public AuditEvent save(AuditEvent domain) {
        AuditEventJpaEntity entity = toEntity(domain);
        AuditEventJpaEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<AuditEvent> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<AuditEvent> findByAggregate(String aggregateType, String aggregateId) {
        return repository.findByAggregateTypeAndAggregateIdOrderByTimestampDesc(aggregateType, aggregateId)
                .stream().map(this::toDomain).toList();
    }

    @Override
    public List<AuditEvent> findRecent(int limit) {
        return repository.findRecentEvents(PageRequest.of(0, limit))
                .stream().map(this::toDomain).toList();
    }

    private AuditEvent toDomain(AuditEventJpaEntity entity) {
        return AuditEvent.builder()
                .id(entity.getId())
                .eventType(entity.getEventType())
                .aggregateType(entity.getAggregateType())
                .aggregateId(entity.getAggregateId())
                .actorEmail(entity.getActorEmail())
                .actorRole(entity.getActorRole())
                .action(entity.getAction())
                .payload(entity.getPayload())
                .ipAddress(entity.getIpAddress())
                .timestamp(entity.getTimestamp())
                .build();
    }

    private AuditEventJpaEntity toEntity(AuditEvent domain) {
        return AuditEventJpaEntity.builder()
                .id(domain.getId() != null ? domain.getId() : UUID.randomUUID())
                .eventType(domain.getEventType())
                .aggregateType(domain.getAggregateType())
                .aggregateId(domain.getAggregateId())
                .actorEmail(domain.getActorEmail())
                .actorRole(domain.getActorRole())
                .action(domain.getAction())
                .payload(domain.getPayload())
                .ipAddress(domain.getIpAddress())
                .timestamp(domain.getTimestamp() != null ? domain.getTimestamp() : Instant.now())
                .build();
    }
}
