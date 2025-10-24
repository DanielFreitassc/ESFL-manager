package com.danielfreitassc.backend.dtos.transactions;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.UUID;

import com.danielfreitassc.backend.dtos.centers.CostCenterResponseDto;
import com.danielfreitassc.backend.dtos.suppliers.SupplierResponseDto;
import com.fasterxml.jackson.annotation.JsonFormat;

public record TransactionResponseDto(
    UUID id,
    String type,
    int installmentNumber,
    CostCenterResponseDto costCenter,
    String expenseCategory,
    String expenseCategoryPt,
    SupplierResponseDto supplier,
    String notes,
    BigDecimal amount,
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDate dueDate,
    Timestamp createdAt,
    String transactionStatus
) {
    
}
