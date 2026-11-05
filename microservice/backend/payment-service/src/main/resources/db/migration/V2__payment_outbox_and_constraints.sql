-- ===================================================================
-- Payment Service Schema Upgrade - Outbox, Idempotency & Unique Constraints
-- ===================================================================

-- 1. Add missing fields to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS webhook_event_id VARCHAR(128);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS refund_id VARCHAR(128);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS refund_status VARCHAR(32);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS version BIGINT DEFAULT 0;

-- 2. Concurrency & Deduplication Unique Indexes
CREATE UNIQUE INDEX IF NOT EXISTS uq_payments_razorpay_payment_id ON payments (razorpay_payment_id) 
WHERE razorpay_payment_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_payments_webhook_event_id ON payments (webhook_event_id) 
WHERE webhook_event_id IS NOT NULL;

-- 3. Transactional Outbox Table for Reliable Kafka Publishing
CREATE TABLE IF NOT EXISTS outbox_events (
    id UUID PRIMARY KEY,
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id VARCHAR(64) NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    event_version INT NOT NULL DEFAULT 1,
    payload TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    retry_count INT NOT NULL DEFAULT 0,
    next_retry_at TIMESTAMP,
    published_at TIMESTAMP,
    last_error TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_outbox_status_created ON outbox_events(status, created_at);

-- 4. Consumer Idempotency Tracking Table
CREATE TABLE IF NOT EXISTS processed_events (
    event_id UUID NOT NULL,
    consumer_group VARCHAR(128) NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, consumer_group)
);
