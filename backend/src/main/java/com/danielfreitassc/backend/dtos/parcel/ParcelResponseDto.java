package com.danielfreitassc.backend.dtos.parcel;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.UUID;

import com.danielfreitassc.backend.models.parcel.ParcelDestination;

public record ParcelResponseDto(
    UUID id,
    ParcelDestination destination,
    BigDecimal amount,
    LocalDate available,
    Timestamp createdAt
) {
    
}
