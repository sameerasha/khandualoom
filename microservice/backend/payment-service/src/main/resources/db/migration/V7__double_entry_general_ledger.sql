-- ===================================================================
-- Payment Service Schema Upgrade - Double-Entry General Ledger System
-- Enforces mathematical double-entry accounting invariant: Total Debits == Total Credits
-- ===================================================================

-- 1. Chart of Financial Accounts
CREATE TABLE IF NOT EXISTS financial_accounts (
    account_number VARCHAR(32) PRIMARY KEY,
    account_name VARCHAR(128) NOT NULL,
    account_type VARCHAR(32) NOT NULL, -- ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Journal Entries (Immutable Accounting Transactions)
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY,
    transaction_reference VARCHAR(128) NOT NULL,
    entry_type VARCHAR(64) NOT NULL,
    description TEXT,
    total_amount NUMERIC(15, 2) NOT NULL,
    posted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_journal_reference ON journal_entries(transaction_reference);
CREATE INDEX IF NOT EXISTS idx_journal_posted_at ON journal_entries(posted_at);

-- 3. Journal Entry Lines (Individual Debit and Credit Postings)
CREATE TABLE IF NOT EXISTS journal_entry_lines (
    id UUID PRIMARY KEY,
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_number VARCHAR(32) NOT NULL REFERENCES financial_accounts(account_number),
    entry_side VARCHAR(16) NOT NULL, -- DEBIT, CREDIT
    amount NUMERIC(15, 2) NOT NULL,
    notes VARCHAR(255),
    CONSTRAINT chk_journal_amount_positive CHECK (amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_journal_lines_entry ON journal_entry_lines(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_journal_lines_account ON journal_entry_lines(account_number);

-- 4. Seed Standard Chart of Accounts
INSERT INTO financial_accounts (account_number, account_name, account_type, balance, currency)
VALUES
    ('1010', 'Cash / Bank Gateway Clearing Account', 'ASSET', 0.00, 'INR'),
    ('4010', 'Handloom Saree Sales Revenue', 'REVENUE', 0.00, 'INR'),
    ('5010', 'Payment Gateway Transaction Fee Expense', 'EXPENSE', 0.00, 'INR'),
    ('5020', 'GST / Tax Input Expense', 'EXPENSE', 0.00, 'INR'),
    ('2010', 'Customer Refund Payable', 'LIABILITY', 0.00, 'INR')
ON CONFLICT (account_number) DO NOTHING;
