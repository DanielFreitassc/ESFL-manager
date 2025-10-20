package com.danielfreitassc.backend.dtos.transactions;

import java.math.BigDecimal;


public record TransactionViewDto(
    String type,
    BigDecimal totalAmount
    //int previousMonth
) {
    
}


