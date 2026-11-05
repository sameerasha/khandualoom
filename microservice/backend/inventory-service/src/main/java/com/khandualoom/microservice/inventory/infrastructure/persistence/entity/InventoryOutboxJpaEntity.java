package com.khandualoom.microservice.inventory.infrastructure.persistence.entity;

import com.khandualoom.microservice.common.messaging.outbox.AbstractOutboxEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "outbox_events")
@NoArgsConstructor
public class InventoryOutboxJpaEntity extends AbstractOutboxEntity {

    public InventoryOutboxJpaEntity(String aggregateType, String aggregateId, String eventType, String payload) {
        super(aggregateType, aggregateId, eventType, payload);
    }
}
