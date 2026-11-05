package com.khandualoom.microservice.contract.event;

import java.io.Serializable;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record NotificationRequestEvent(
    UUID eventId,
    String recipient,
    String channel,
    String template,
    Map<String, String> parameters,
    Instant timestamp
) implements Serializable {

    public static NotificationRequestEvent create(
        String recipient,
        String channel,
        String template,
        Map<String, String> parameters
    ) {
        return new NotificationRequestEvent(
            UUID.randomUUID(),
            recipient,
            channel,
            template,
            parameters,
            Instant.now()
        );
    }
}
