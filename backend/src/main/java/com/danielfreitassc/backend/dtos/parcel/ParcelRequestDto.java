package com.danielfreitassc.backend.dtos.parcel;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.danielfreitassc.backend.models.parcel.ParcelDestination;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ParcelRequestDto(
    @NotNull(message = "Uma parcela precisa de um destino")
    ParcelDestination destination,
    @Min(value = 0, message = "O valor de uma parcela não pode ser negativo")
    BigDecimal amount,
    @NotNull(message = "Uma parcela precisa indicar quando estara disponivel")
    LocalDate available
) {
    
}
