package com.danielfreitassc.backend.dtos.suppliers;

import java.util.UUID;

public record SupplierSelectDto(
    UUID id,
    String name
) {
    
}
