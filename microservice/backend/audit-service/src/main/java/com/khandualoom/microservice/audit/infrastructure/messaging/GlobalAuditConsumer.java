package com.khandualoom.microservice.audit.infrastructure.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khandualoom.microservice.audit.application.service.AuditApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class GlobalAuditConsumer {

    private final AuditApplicationService auditService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = {
        "orders.order-created", 
        "order-created", 
        "payment-completed", 
        "payments.payment-failed", 
        "inventory.reserved", 
        "inventory.stock-updated"
    }, groupId = "audit-service-group")
    public void consumeAuditEvent(ConsumerRecord<String, Object> record) {
        try {
            String topic = record.topic();
            String key = record.key() != null ? record.key() : "unknown";
            String rawJson = objectMapper.writeValueAsString(record.value());
            String payloadJson = maskSensitiveData(rawJson);

            String aggregateType = resolveAggregateType(topic);
            String action = resolveAction(topic);

            auditService.recordEvent(
                topic,
                aggregateType,
                key,
                "system-event-bus",
                "SYSTEM",
                action,
                payloadJson,
                "kafka-cluster"
            );
            log.info("Audited Kafka event from topic: {}, key: {}", topic, key);
        } catch (Exception e) {
            log.error("Failed to audit Kafka record from topic {}: {}", record.topic(), e.getMessage());
        }
    }

    private String maskSensitiveData(String json) {
        if (json == null) return "{}";
        return json
            .replaceAll("(?i)\"password\"\\s*:\\s*\"[^\"]+\"", "\"password\":\"***\"")
            .replaceAll("(?i)\"secret\"\\s*:\\s*\"[^\"]+\"", "\"secret\":\"***\"")
            .replaceAll("(?i)\"token\"\\s*:\\s*\"[^\"]+\"", "\"token\":\"***\"")
            .replaceAll("(?i)\"cvv\"\\s*:\\s*\"[^\"]+\"", "\"cvv\":\"***\"");
    }

    private String resolveAggregateType(String topic) {
        if (topic.contains("order")) return "ORDER";
        if (topic.contains("payment")) return "PAYMENT";
        if (topic.contains("inventory")) return "INVENTORY";
        return "GENERIC";
    }

    private String resolveAction(String topic) {
        if (topic.contains("created")) return "ORDER_CREATED";
        if (topic.contains("payment-completed")) return "PAYMENT_SUCCESS";
        if (topic.contains("payment-failed")) return "PAYMENT_FAILED";
        if (topic.contains("reserved")) return "INVENTORY_RESERVED";
        if (topic.contains("stock-updated")) return "STOCK_UPDATED";
        return "EVENT_DISPATCHED";
    }
}
