-- ===================================================================
-- Payment Settlement Ledger & Batch Reconciliation History
-- ===================================================================

CREATE TABLE IF NOT EXISTS payment_settlement_ledger (
    settlement_id UUID PRIMARY KEY,
    razorpay_settlement_id VARCHAR(128) NOT NULL,
    razorpay_payment_id VARCHAR(128),
    order_id BIGINT,
    settlement_utr VARCHAR(128),
    gross_amount DECIMAL(12,2) NOT NULL,
    fee DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    net_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(16) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL,
    discrepancy_reason TEXT,
    settled_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_settlement_rzp_id ON payment_settlement_ledger (razorpay_settlement_id);
CREATE INDEX IF NOT EXISTS idx_settlement_payment_id ON payment_settlement_ledger (razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_settlement_order_id ON payment_settlement_ledger (order_id);
CREATE INDEX IF NOT EXISTS idx_settlement_status ON payment_settlement_ledger (status);
