package com.danielfreitassc.backend.dtos.centers;

import java.util.UUID;

import com.danielfreitassc.backend.models.centers.CostType;

public record CostCenterResponseDto(
    UUID id,
    String name,
    CostType type
) {
    
}
