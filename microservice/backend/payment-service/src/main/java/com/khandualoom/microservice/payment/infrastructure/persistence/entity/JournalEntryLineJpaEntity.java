package com.khandualoom.microservice.payment.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "journal_entry_lines")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntryLineJpaEntity {

    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_entry_id", nullable = false)
    private JournalEntryJpaEntity journalEntry;

    @Column(name = "account_number", length = 32, nullable = false)
    private String accountNumber;

    @Column(name = "entry_side", length = 16, nullable = false) // DEBIT, CREDIT
    private String entrySide;

    @Column(name = "amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "notes", length = 255)
    private String notes;
}
