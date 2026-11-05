package com.khandualoom.microservice.audit.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditEvent {
    private UUID id;
    private String eventType;
    private String aggregateType;
    private String aggregateId;
    private String actorEmail;
    private String actorRole;
    private String action;
    private String payload;
    private String ipAddress;
    private Instant timestamp;
}
