package com.khandualoom.microservice.audit.presentation.controller;

import com.khandualoom.microservice.audit.application.dto.AuditEventDto;
import com.khandualoom.microservice.audit.application.service.AuditApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@Slf4j
@RequiredArgsConstructor
public class AuditController {

    private final AuditApplicationService auditService;

    @GetMapping("/recent")
    public ResponseEntity<List<AuditEventDto>> getRecentAuditEvents(
            @RequestParam(defaultValue = "50") int limit
    ) {
        return ResponseEntity.ok(auditService.getRecentAuditEvents(limit));
    }

    @GetMapping("/aggregate/{type}/{id}")
    public ResponseEntity<List<AuditEventDto>> getAggregateAuditTrail(
            @PathVariable String type,
            @PathVariable String id
    ) {
        return ResponseEntity.ok(auditService.getAuditTrail(type.toUpperCase(), id));
    }
}
