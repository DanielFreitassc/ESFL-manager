package com.danielfreitassc.backend.dtos.transactions;

import java.math.BigDecimal;

public record TransactionCategoryDto(
    String type,
    BigDecimal amount,
    String notes
) {
    
}
