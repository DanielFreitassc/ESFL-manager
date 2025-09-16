package com.danielfreitassc.backend.dtos.suppliers;

import java.util.UUID;

public record SupplierResponseDto(
    UUID id,
    String name,
    String cnpj,
    String corporateName
) {
    
}
