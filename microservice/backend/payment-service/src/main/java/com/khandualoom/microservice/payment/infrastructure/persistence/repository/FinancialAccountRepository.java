package com.khandualoom.microservice.payment.infrastructure.persistence.repository;

import com.khandualoom.microservice.payment.infrastructure.persistence.entity.FinancialAccountJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FinancialAccountRepository extends JpaRepository<FinancialAccountJpaEntity, String> {
    Optional<FinancialAccountJpaEntity> findByAccountNumber(String accountNumber);
}
