package com.khandualoom.microservice.audit.application.service;

import com.khandualoom.microservice.audit.application.dto.AuditEventDto;
import com.khandualoom.microservice.audit.domain.model.AuditEvent;
import com.khandualoom.microservice.audit.domain.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuditApplicationService {

    private final AuditRepository auditRepository;

    @Transactional
    public AuditEventDto recordEvent(
            String eventType,
            String aggregateType,
            String aggregateId,
            String actorEmail,
            String actorRole,
            String action,
            String payload,
            String ipAddress
    ) {
        AuditEvent event = AuditEvent.builder()
                .id(UUID.randomUUID())
                .eventType(eventType)
                .aggregateType(aggregateType)
                .aggregateId(aggregateId)
                .actorEmail(actorEmail)
                .actorRole(actorRole)
                .action(action)
                .payload(payload)
                .ipAddress(ipAddress)
                .timestamp(Instant.now())
                .build();

        AuditEvent saved = auditRepository.save(event);
        log.info("Audit entry committed: id={}, type={}, aggregate={}:{}", saved.getId(), eventType, aggregateType, aggregateId);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<AuditEventDto> getAuditTrail(String aggregateType, String aggregateId) {
        return auditRepository.findByAggregate(aggregateType, aggregateId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AuditEventDto> getRecentAuditEvents(int limit) {
        return auditRepository.findRecent(limit).stream()
                .map(this::toDto)
                .toList();
    }

    private AuditEventDto toDto(AuditEvent e) {
        return AuditEventDto.builder()
                .id(e.getId())
                .eventType(e.getEventType())
                .aggregateType(e.getAggregateType())
                .aggregateId(e.getAggregateId())
                .actorEmail(e.getActorEmail())
                .actorRole(e.getActorRole())
                .action(e.getAction())
                .payload(e.getPayload())
                .ipAddress(e.getIpAddress())
                .timestamp(e.getTimestamp())
                .build();
    }
}
