package com.khandualoom.microservice.order.model;

import com.khandualoom.microservice.common.messaging.outbox.AbstractOutboxEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "outbox_events")
@NoArgsConstructor
public class OutboxEvent extends AbstractOutboxEntity {

    public OutboxEvent(String aggregateType, String aggregateId, String eventType, String payload) {
        super(aggregateType, aggregateId, eventType, payload);
    }
}
