package com.danielfreitassc.backend.dtos.centers;

import java.util.UUID;

public record CostCenterSelectDto(
    UUID id,
    String name
) {
    
}
