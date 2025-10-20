package com.danielfreitassc.backend.repositories.transactions;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.transactions.TransactionEntity;
import com.danielfreitassc.backend.models.transactions.TransactionType;

public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {
    Page<TransactionEntity> findByApprovedTrue(Pageable pageable);
    Page<TransactionEntity> findByApprovedFalse(Pageable pageable);
    List<TransactionEntity> findAllByType(TransactionType income);
}
