package com.khandualoom.microservice.payment.application.service;

import com.khandualoom.microservice.payment.infrastructure.persistence.entity.FinancialAccountJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.entity.JournalEntryJpaEntity;
import com.khandualoom.microservice.payment.infrastructure.persistence.repository.FinancialAccountRepository;
import com.khandualoom.microservice.payment.infrastructure.persistence.repository.JournalEntryRepository;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DoubleEntryLedgerServiceTest {

    @Mock
    private FinancialAccountRepository accountRepository;

    @Mock
    private JournalEntryRepository journalEntryRepository;

    private DoubleEntryLedgerService ledgerService;
    private final SimpleMeterRegistry meterRegistry = new SimpleMeterRegistry();

    @BeforeEach
    void setUp() {
        ledgerService = new DoubleEntryLedgerService(
                accountRepository,
                journalEntryRepository,
                Optional.of(meterRegistry)
        );
    }

    @Test
    @DisplayName("Should post balanced settlement journal entry: Debits == Credits")
    void shouldPostBalancedSettlementJournalEntry() {
        BigDecimal gross = new BigDecimal("10000.00");
        BigDecimal fee = new BigDecimal("170.00");
        BigDecimal tax = new BigDecimal("30.00");
        BigDecimal net = new BigDecimal("9800.00");

        FinancialAccountJpaEntity bankAcc = FinancialAccountJpaEntity.builder()
                .accountNumber("1010")
                .accountName("Bank Clearing")
                .accountType("ASSET")
                .balance(BigDecimal.ZERO)
                .build();

        FinancialAccountJpaEntity revenueAcc = FinancialAccountJpaEntity.builder()
                .accountNumber("4010")
                .accountName("Sales Revenue")
                .accountType("REVENUE")
                .balance(BigDecimal.ZERO)
                .build();

        when(accountRepository.findByAccountNumber("1010")).thenReturn(Optional.of(bankAcc));
        when(accountRepository.findByAccountNumber("4010")).thenReturn(Optional.of(revenueAcc));
        when(accountRepository.findByAccountNumber("5010")).thenReturn(Optional.empty());
        when(accountRepository.findByAccountNumber("5020")).thenReturn(Optional.empty());
        when(journalEntryRepository.save(any(JournalEntryJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        JournalEntryJpaEntity entry = ledgerService.postSettlementJournalEntry(
                "setl_test_101", gross, fee, tax, net
        );

        assertThat(entry).isNotNull();
        assertThat(entry.getTotalAmount()).isEqualByComparingTo(new BigDecimal("10000.00"));
        assertThat(entry.getLines()).hasSize(4);

        // Verify Debits (9800 + 170 + 30 = 10000) == Credit (10000)
        BigDecimal debits = entry.getLines().stream()
                .filter(l -> "DEBIT".equals(l.getEntrySide()))
                .map(DoubleEntryLedgerServiceTest::getLineAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal credits = entry.getLines().stream()
                .filter(l -> "CREDIT".equals(l.getEntrySide()))
                .map(DoubleEntryLedgerServiceTest::getLineAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        assertThat(debits).isEqualByComparingTo(credits);
        assertThat(debits).isEqualByComparingTo(new BigDecimal("10000.00"));

        // Verify account balance updated (Bank Asset increased by 9800)
        assertThat(bankAcc.getBalance()).isEqualByComparingTo(new BigDecimal("9800.00"));
        // Verify Sales Revenue Credit increased by 10000
        assertThat(revenueAcc.getBalance()).isEqualByComparingTo(new BigDecimal("10000.00"));

        verify(journalEntryRepository).save(any(JournalEntryJpaEntity.class));
    }

    @Test
    @DisplayName("Should strictly REJECT unbalanced journal entry: Debits != Credits")
    void shouldRejectUnbalancedJournalEntry() {
        List<DoubleEntryLedgerService.JournalLineRequest> lines = List.of(
                DoubleEntryLedgerService.JournalLineRequest.builder()
                        .accountNumber("1010")
                        .entrySide("DEBIT")
                        .amount(new BigDecimal("5000.00"))
                        .build(),
                DoubleEntryLedgerService.JournalLineRequest.builder()
                        .accountNumber("4010")
                        .entrySide("CREDIT")
                        .amount(new BigDecimal("4500.00")) // Mismatch!
                        .build()
        );

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                ledgerService.postJournalEntry("ref_err_01", "TEST_ENTRY", "Test unbalanced", lines)
        );

        assertThat(ex.getMessage()).contains("Unbalanced journal entry");
        verify(journalEntryRepository, never()).save(any());
        assertThat(meterRegistry.counter("khandualoom.ledger.unbalanced_attempt").count()).isEqualTo(1.0);
    }

    private static BigDecimal getLineAmount(com.khandualoom.microservice.payment.infrastructure.persistence.entity.JournalEntryLineJpaEntity line) {
        return line.getAmount();
    }
}
