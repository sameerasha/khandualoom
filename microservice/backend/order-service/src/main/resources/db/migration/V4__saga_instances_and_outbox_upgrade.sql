-- ===================================================================
-- Order Service Schema Upgrade - Persistent Saga Instances & Enhanced Outbox
-- ===================================================================

-- 1. Persistent Saga Instances Table
CREATE TABLE IF NOT EXISTS saga_instances (
    saga_id UUID PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    current_step VARCHAR(32) NOT NULL,
    saga_status VARCHAR(32) NOT NULL,
    step_started_at TIMESTAMP NOT NULL,
    deadline_at TIMESTAMP NOT NULL,
    retry_count INT NOT NULL DEFAULT 0,
    last_error TEXT,
    next_retry_at TIMESTAMP,
    compensation_status VARCHAR(32) DEFAULT 'NONE',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_saga_overdue ON saga_instances(saga_status, deadline_at);

-- 2. Enhanced Outbox Columns for Retry & Concurrency Protection
ALTER TABLE outbox_events ADD COLUMN IF NOT EXISTS event_version INT NOT NULL DEFAULT 1;
ALTER TABLE outbox_events ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'PENDING';
ALTER TABLE outbox_events ADD COLUMN IF NOT EXISTS retry_count INT NOT NULL DEFAULT 0;
ALTER TABLE outbox_events ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMP;
ALTER TABLE outbox_events ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;
ALTER TABLE outbox_events ADD COLUMN IF NOT EXISTS last_error TEXT;

CREATE INDEX IF NOT EXISTS idx_order_outbox_status ON outbox_events(status, created_at);

-- 3. Consumer Idempotency Tracking Table
CREATE TABLE IF NOT EXISTS processed_events (
    event_id UUID NOT NULL,
    consumer_group VARCHAR(128) NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, consumer_group)
);
