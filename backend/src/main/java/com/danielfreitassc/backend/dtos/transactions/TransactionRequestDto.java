package com.danielfreitassc.backend.dtos.transactions;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.danielfreitassc.backend.models.transactions.ExpenseCategory;
import com.danielfreitassc.backend.models.transactions.TransactionStatus;
import com.danielfreitassc.backend.models.transactions.TransactionType;
import com.fasterxml.jackson.annotation.JsonFormat;

public record TransactionRequestDto(
    TransactionType type,
    int installmentNumber,
    UUID costCenterId,
    ExpenseCategory expenseCategory,
    UUID supplierId,
    String notes,
    BigDecimal amount,
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDate dueDate,
    TransactionStatus transactionStatus
) {
    
}
