-- ===================================================================
-- Inventory Service Schema Upgrade - Outbox Lease Locks & Autovacuum Tuning
-- ===================================================================

-- 1. Publisher Lease Owner & Expiration Columns for Outbox
ALTER TABLE outbox_events ADD COLUMN IF NOT EXISTS locked_by VARCHAR(128);
ALTER TABLE outbox_events ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_inv_outbox_lease ON outbox_events(status, locked_until);

-- 2. PostgreSQL Table-Level Autovacuum Tuning for High-Churn Tables
ALTER TABLE outbox_events SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_vacuum_cost_limit = 1000
);

ALTER TABLE stock_reservations SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_vacuum_cost_limit = 1000
);

ALTER TABLE processed_events SET (
    autovacuum_vacuum_scale_factor = 0.05
);
