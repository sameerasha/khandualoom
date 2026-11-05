package com.khandualoom.microservice.payment.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_accounts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialAccountJpaEntity {

    @Id
    @Column(name = "account_number", length = 32, nullable = false)
    private String accountNumber;

    @Column(name = "account_name", length = 128, nullable = false)
    private String accountName;

    @Column(name = "account_type", length = 32, nullable = false)
    private String accountType; // ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE

    @Column(name = "balance", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "currency", length = 8, nullable = false)
    @Builder.Default
    private String currency = "INR";

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
