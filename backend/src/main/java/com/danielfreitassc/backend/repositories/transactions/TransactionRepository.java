package com.danielfreitassc.backend.repositories.transactions;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.transactions.ExpenseCategory;
import com.danielfreitassc.backend.models.transactions.TransactionEntity;
import com.danielfreitassc.backend.models.transactions.TransactionType;

public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {
    List<TransactionEntity> findAllByType(TransactionType income);
    List<TransactionEntity> findAllByExpenseCategoryAndType(ExpenseCategory expenseCategory,TransactionType type);
    List<TransactionEntity> findAllByDueDateBetweenAndType(
        LocalDate start,
        LocalDate end,
        TransactionType type
    );
}
