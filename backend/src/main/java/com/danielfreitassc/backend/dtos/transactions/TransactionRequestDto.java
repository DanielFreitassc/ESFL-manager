package com.danielfreitassc.backend.dtos.transactions;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.danielfreitassc.backend.controllers.centers.CostCenterController;
import com.danielfreitassc.backend.models.suppliers.SupplierEntity;
import com.danielfreitassc.backend.models.transactions.ExpenseCategory;
import com.danielfreitassc.backend.models.transactions.TransactionStatus;
import com.danielfreitassc.backend.models.transactions.TransactionType;
import com.fasterxml.jackson.annotation.JsonFormat;

public record TransactionRequestDto(
    TransactionType type,
    int installmentNumber,
    CostCenterController costCenter,
    ExpenseCategory expenseCategory,
    SupplierEntity supplier,
    String notes,
    BigDecimal amount,
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDate dueDate,
    TransactionStatus transactionStatus
) {
    
}
