-- ===================================================================
-- Payment Service Schema Upgrade - Payment Operation Ledger
-- ===================================================================

CREATE TABLE IF NOT EXISTS payment_operation_ledger (
    operation_id UUID PRIMARY KEY,
    order_id BIGINT NOT NULL,
    razorpay_order_id VARCHAR(128),
    razorpay_payment_id VARCHAR(128),
    idempotency_key VARCHAR(128),
    operation_type VARCHAR(64) NOT NULL,
    request_hash VARCHAR(64),
    status VARCHAR(32) NOT NULL DEFAULT 'INITIATED',
    gateway_reference VARCHAR(128),
    gateway_response TEXT,
    retry_count INT NOT NULL DEFAULT 0,
    last_reconciled_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ledger_order_id ON payment_operation_ledger(order_id);
CREATE INDEX IF NOT EXISTS idx_ledger_razorpay_order_id ON payment_operation_ledger(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_ledger_razorpay_payment_id ON payment_operation_ledger(razorpay_payment_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_ledger_idempotency ON payment_operation_ledger(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ledger_status_created ON payment_operation_ledger(status, created_at);
