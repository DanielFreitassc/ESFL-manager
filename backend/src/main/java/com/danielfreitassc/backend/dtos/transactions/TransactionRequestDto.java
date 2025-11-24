package com.danielfreitassc.backend.dtos.transactions;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.danielfreitassc.backend.models.transactions.ExpenseCategory;
import com.danielfreitassc.backend.models.transactions.TransactionStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record TransactionRequestDto(
    @Min(value = 0, message = "O valor não pode ser negativo")
    int installmentNumber,

    @NotNull(message = "Indicar um centro de custo é necessário!")
    UUID costCenterId,
    
    @NotNull(message = "Indicar uma categoria de despesa é necessário!")
    ExpenseCategory expenseCategory,

    @NotNull(message = "Indicar um fornecedor é necessário!")
    UUID supplierId,

    String notes,

    @DecimalMin(value = "0.0", inclusive = true, message = "O valor não pode ser negativo")
    BigDecimal amount,

    @JsonFormat(pattern = "dd/MM/yyyy")
    @NotNull(message = "A data de vencimento é obrigatória.")
    @FutureOrPresent(message = "A data de vencimento não pode ser anterior à data atual.")
    LocalDate dueDate,

    @NotNull(message = "O status da transação é obrigatório.")
    TransactionStatus transactionStatus
) {
    
}
