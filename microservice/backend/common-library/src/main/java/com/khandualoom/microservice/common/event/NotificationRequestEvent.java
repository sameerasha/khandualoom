package com.khandualoom.microservice.common.event;

import java.io.Serializable;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record NotificationRequestEvent(
    UUID eventId,
    String recipientEmail,
    String recipientPhone,
    String channel, // EMAIL, SMS, WHATSAPP
    String subject,
    String content,
    Map<String, String> metadata,
    Instant timestamp
) implements Serializable {

    public static NotificationRequestEvent email(
        String recipientEmail,
        String subject,
        String content,
        Map<String, String> metadata
    ) {
        return new NotificationRequestEvent(
            UUID.randomUUID(),
            recipientEmail,
            null,
            "EMAIL",
            subject,
            content,
            metadata,
            Instant.now()
        );
    }
}
