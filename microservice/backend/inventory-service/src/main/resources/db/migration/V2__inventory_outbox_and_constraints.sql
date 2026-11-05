-- ===================================================================
-- Inventory Service Schema Upgrade - Outbox, Idempotency & Deduplication
-- ===================================================================

-- 1. Unique constraint to prevent duplicate reservations for the same order and product
CREATE UNIQUE INDEX IF NOT EXISTS uq_stock_reservations_order_product 
ON stock_reservations (order_id, product_id);

-- 2. Transactional Outbox Table for Inventory Service
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

CREATE INDEX IF NOT EXISTS idx_inventory_outbox_status_created ON outbox_events(status, created_at);

-- 3. Consumer Idempotency Tracking Table
CREATE TABLE IF NOT EXISTS processed_events (
    event_id UUID NOT NULL,
    consumer_group VARCHAR(128) NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, consumer_group)
);
