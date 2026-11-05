package com.khandualoom.microservice.payment.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "journal_entries")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntryJpaEntity {

    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "transaction_reference", length = 128, nullable = false)
    private String transactionReference;

    @Column(name = "entry_type", length = 64, nullable = false)
    private String entryType;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "total_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "posted_at", nullable = false)
    @Builder.Default
    private LocalDateTime postedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "journalEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<JournalEntryLineJpaEntity> lines = new ArrayList<>();

    public void addLine(JournalEntryLineJpaEntity line) {
        lines.add(line);
        line.setJournalEntry(this);
    }
}
