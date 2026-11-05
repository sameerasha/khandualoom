-- ===================================================================
-- Khandua Looms – Automated Production Invariant Verification Suite
-- Run this script against PostgreSQL after any stress-test or flash-sale load run
-- ===================================================================

\echo '====================================================='
\echo '  Khandua Looms Post-Stress Invariant Verification'
\echo '====================================================='

-- 1. INVENTORY NON-NEGATIVITY INVARIANT
-- Verifies that available_stock never drops below zero and conservation of stock holds
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'PASS: No negative available_stock detected'
        ELSE 'FAIL: CRITICAL - Negative available_stock detected!'
    END AS invariant_1_negative_available
FROM inventory_schema.inventory_items
WHERE available_stock < 0;

SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'PASS: No negative reserved_stock detected'
        ELSE 'FAIL: CRITICAL - Negative reserved_stock detected!'
    END AS invariant_1b_negative_reserved
FROM inventory_schema.inventory_items
WHERE reserved_stock < 0;

SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'PASS: Stock conservation holds (available + reserved = total)'
        ELSE 'FAIL: CRITICAL - Stock conservation violated!'
    END AS invariant_1c_stock_conservation
FROM inventory_schema.inventory_items
WHERE (available_stock + reserved_stock) != total_stock;


-- 2. ORDER IDEMPOTENCY INVARIANT
-- Verifies that no duplicate orders were created for the same idempotency key
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'PASS: Strict client idempotency preserved (0 duplicates)'
        ELSE 'FAIL: CRITICAL - Duplicate orders created for identical idempotency key!'
    END AS invariant_2_order_idempotency
FROM (
    SELECT idempotency_key, COUNT(*) AS dup_count
    FROM order_schema.orders
    WHERE idempotency_key IS NOT NULL
    GROUP BY idempotency_key
    HAVING COUNT(*) > 1
) sub;


-- 3. DOUBLE-ENTRY ACCOUNTING INVARIANT
-- Mathematically verifies that every journal entry balances: SUM(Debits) == SUM(Credits)
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'PASS: Double-entry equilibrium holds across all transactions'
        ELSE 'FAIL: CRITICAL - Unbalanced journal entries detected!'
    END AS invariant_3_double_entry_balance
FROM (
    SELECT 
        journal_entry_id,
        SUM(CASE WHEN entry_side = 'DEBIT' THEN amount ELSE -amount END) AS imbalance
    FROM payment_schema.journal_entry_lines
    GROUP BY journal_entry_id
    HAVING SUM(CASE WHEN entry_side = 'DEBIT' THEN amount ELSE -amount END) != 0.00
) sub;


-- 4. FINANCIAL SETTLEMENT ARITHMETIC INVARIANT
-- Verifies that Gross - Fee - Tax == Net holds for all recorded settlement items
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'PASS: Settlement ledger arithmetic verified (Gross - Fee - Tax = Net)'
        ELSE 'FAIL: CRITICAL - Settlement calculation discrepancy detected!'
    END AS invariant_4_settlement_arithmetic
FROM payment_schema.payment_settlement_ledger
WHERE (gross_amount - fee - tax) != net_amount;


-- 5. TRANSACTIONAL OUTBOX INTEGRITY INVARIANT
-- Verifies that no committed outbox event is stranded without resolution
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'PASS: Outbox queues healthy (0 events stuck in permanent lock)'
        ELSE 'FAIL: Outbox events locked beyond lease timeout!'
    END AS invariant_5_outbox_lease_health
FROM order_schema.outbox_events
WHERE status = 'PENDING' 
  AND locked_until < (CURRENT_TIMESTAMP - INTERVAL '5 minutes');

\echo '====================================================='
\echo '  Invariant Verification Completed'
\echo '====================================================='
