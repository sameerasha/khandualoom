-- Add OpenTelemetry distributed trace context and correlation IDs to outbox events
ALTER TABLE outbox_events ADD COLUMN IF NOT EXISTS traceparent VARCHAR(128);
ALTER TABLE outbox_events ADD COLUMN IF NOT EXISTS correlation_id VARCHAR(128);
ALTER TABLE outbox_events ADD COLUMN IF NOT EXISTS causation_id VARCHAR(128);
