-- ===================================================================
-- Audit Service Schema - Centralized Immutable Audit Trail
-- ===================================================================

CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY,
    event_type VARCHAR(128) NOT NULL,
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id VARCHAR(64) NOT NULL,
    actor_email VARCHAR(255),
    actor_role VARCHAR(64),
    action VARCHAR(64) NOT NULL,
    payload TEXT,
    ip_address VARCHAR(64),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_aggregate ON audit_events(aggregate_type, aggregate_id);
CREATE INDEX IF NOT EXISTS idx_audit_event_type ON audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_events(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_events(timestamp);
