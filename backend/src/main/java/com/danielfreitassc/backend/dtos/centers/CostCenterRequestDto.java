package com.danielfreitassc.backend.dtos.centers;

import com.danielfreitassc.backend.models.centers.CostType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CostCenterRequestDto(
    @NotBlank(message = "Um custo precisa de um nome")
    String name,
    @NotNull(message = "Um custo precisa tipo")
    CostType type
) {
    
}
