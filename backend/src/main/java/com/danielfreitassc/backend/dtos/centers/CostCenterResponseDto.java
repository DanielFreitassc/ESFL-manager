package com.danielfreitassc.backend.dtos.centers;

import java.util.UUID;

public record CostCenterResponseDto(
    UUID id,
    String name,
    String type
) {
    
}
