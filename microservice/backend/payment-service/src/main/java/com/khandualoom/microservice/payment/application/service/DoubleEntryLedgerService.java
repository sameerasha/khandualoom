package com.khandualoom.microservice.payment.application.service;

import com.khandualoom.microservice.payment.infrastructure.persistence.entity.FinancialAccountJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.JournalEntryJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.JournalEntryLineJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.repository.FinancialAccountRepository;
import com.khandualoom.microservice.payment.infrastructure.persistence.repository.JournalEntryRepository;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Enterprise Double-Entry General Ledger Service.
 * Mathematically guarantees that for every accounting posting:
 * Total Debits == Total Credits.
 * Provides statutory audit compliance for fintech merchant settlement and sales revenue.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DoubleEntryLedgerService {

    public static final String ACC_BANK_CLEARING = "1010"; // ASSET
    public static final String ACC_SALES_REVENUE = "4010"; // REVENUE
    public static final String ACC_GATEWAY_FEE   = "5010"; // EXPENSE
    public static final String ACC_GST_EXPENSE   = "5020"; // EXPENSE
    public static final String ACC_REFUND_PAYABLE = "2010"; // LIABILITY

    private final FinancialAccountRepository accountRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final Optional<MeterRegistry> meterRegistry;

    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class JournalLineRequest {
        private String accountNumber;
        private String entrySide; // DEBIT or CREDIT
        private BigDecimal amount;
        private String notes;
    }

    /**
     * Posts an atomic balanced journal entry.
     * Enforces mathematical invariant: SUM(Debits) == SUM(Credits).
     */
    @Transactional
    public JournalEntryJpaEntity postJournalEntry(
            String transactionReference,
            String entryType,
            String description,
            List<JournalLineRequest> lines) {

        if (lines == null || lines.size() < 2) {
            throw new IllegalArgumentException("A double-entry journal entry requires at least two lines");
        }

        BigDecimal totalDebits = BigDecimal.ZERO;
        BigDecimal totalCredits = BigDecimal.ZERO;

        for (JournalLineRequest line : lines) {
            if (line.getAmount() == null || line.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Line amount must be positive: " + line.getAmount());
            }

            if ("DEBIT".equalsIgnoreCase(line.getEntrySide())) {
                totalDebits = totalDebits.add(line.getAmount());
            } else if ("CREDIT".equalsIgnoreCase(line.getEntrySide())) {
                totalCredits = totalCredits.add(line.getAmount());
            } else {
                throw new IllegalArgumentException("Invalid entry side (must be DEBIT or CREDIT): " + line.getEntrySide());
            }
        }

        // Strict Mathematical Invariant Check: Sum(Debits) == Sum(Credits)
        if (totalDebits.compareTo(totalCredits) != 0) {
            String errorMsg = String.format(
                    "Unbalanced journal entry for [%s]: Total Debits [%s] != Total Credits [%s]",
                    transactionReference, totalDebits, totalCredits);
            log.error(errorMsg);
            meterRegistry.ifPresent(reg -> reg.counter("khandualoom.ledger.unbalanced_attempt").increment());
            throw new IllegalStateException(errorMsg);
        }

        UUID entryId = UUID.randomUUID();
        JournalEntryJpaEntity entry = JournalEntryJpaEntity.builder()
                .id(entryId)
                .transactionReference(transactionReference)
                .entryType(entryType)
                .description(description)
                .totalAmount(totalDebits)
                .postedAt(LocalDateTime.now())
                .lines(new ArrayList<>())
                .build();

        for (JournalLineRequest lineReq : lines) {
            JournalEntryLineJpaEntity lineEntity = JournalEntryLineJpaEntity.builder()
                    .id(UUID.randomUUID())
                    .accountNumber(lineReq.getAccountNumber())
                    .entrySide(lineReq.getEntrySide().toUpperCase())
                    .amount(lineReq.getAmount())
                    .notes(lineReq.getNotes())
                    .build();
            entry.addLine(lineEntity);

            // Update Account Running Balance
            accountRepository.findByAccountNumber(lineReq.getAccountNumber()).ifPresent(acc -> {
                BigDecimal currentBalance = acc.getBalance() != null ? acc.getBalance() : BigDecimal.ZERO;
                boolean isDebit = "DEBIT".equalsIgnoreCase(lineReq.getEntrySide());
                String type = acc.getAccountType().toUpperCase();

                // Standard accounting balance equations
                // ASSET & EXPENSE increase with DEBIT, decrease with CREDIT
                // LIABILITY, EQUITY & REVENUE increase with CREDIT, decrease with DEBIT
                if ("ASSET".equals(type) || "EXPENSE".equals(type)) {
                    acc.setBalance(isDebit ? currentBalance.add(lineReq.getAmount()) : currentBalance.subtract(lineReq.getAmount()));
                } else {
                    acc.setBalance(isDebit ? currentBalance.subtract(lineReq.getAmount()) : currentBalance.add(lineReq.getAmount()));
                }
                accountRepository.save(acc);
            });
        }

        JournalEntryJpaEntity saved = journalEntryRepository.save(entry);
        log.info("Posted balanced journal entry [{}] for ref [{}], amount: ₹{}",
                entryId, transactionReference, totalDebits);

        meterRegistry.ifPresent(reg -> reg.counter("khandualoom.ledger.journal_entry_posted").increment());
        return saved;
    }

    /**
     * Posts a balanced settlement journal entry from gateway figures.
     * DEBIT: Bank Clearing (Net) + Fee Expense (Fee) + GST Expense (Tax)
     * CREDIT: Sales Revenue (Gross)
     */
    @Transactional
    public JournalEntryJpaEntity postSettlementJournalEntry(
            String settlementReference,
            BigDecimal gross,
            BigDecimal fee,
            BigDecimal tax,
            BigDecimal net) {

        BigDecimal safeGross = gross != null ? gross : BigDecimal.ZERO;
        BigDecimal safeFee = fee != null ? fee : BigDecimal.ZERO;
        BigDecimal safeTax = tax != null ? tax : BigDecimal.ZERO;
        BigDecimal safeNet = net != null ? net : safeGross.subtract(safeFee).subtract(safeTax);

        List<JournalLineRequest> lines = new ArrayList<>();

        // Debits (Assets & Expenses)
        if (safeNet.compareTo(BigDecimal.ZERO) > 0) {
            lines.add(JournalLineRequest.builder()
                    .accountNumber(ACC_BANK_CLEARING)
                    .entrySide("DEBIT")
                    .amount(safeNet)
                    .notes("Net settlement deposited to bank")
                    .build());
        }
        if (safeFee.compareTo(BigDecimal.ZERO) > 0) {
            lines.add(JournalLineRequest.builder()
                    .accountNumber(ACC_GATEWAY_FEE)
                    .entrySide("DEBIT")
                    .amount(safeFee)
                    .notes("Payment gateway fee deduction")
                    .build());
        }
        if (safeTax.compareTo(BigDecimal.ZERO) > 0) {
            lines.add(JournalLineRequest.builder()
                    .accountNumber(ACC_GST_EXPENSE)
                    .entrySide("DEBIT")
                    .amount(safeTax)
                    .notes("GST on payment gateway fee")
                    .build());
        }

        // Credit (Revenue)
        lines.add(JournalLineRequest.builder()
                .accountNumber(ACC_SALES_REVENUE)
                .entrySide("CREDIT")
                .amount(safeGross)
                .notes("Recognized handloom saree sales revenue")
                .build());

        return postJournalEntry(
                settlementReference,
                "PAYMENT_SETTLEMENT",
                "Settlement posting for reference " + settlementReference,
                lines
        );
    }
}
