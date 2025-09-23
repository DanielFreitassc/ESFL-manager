package com.danielfreitassc.backend.repositories.transactions;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.transactions.TransactionEntity;

public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {
    Page<TransactionEntity> findByApprovedTrue(Pageable pageable);
    Page<TransactionEntity> findByApprovedFalse(Pageable pageable);
}
