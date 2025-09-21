package com.danielfreitassc.backend.dtos.suppliers;


import org.hibernate.validator.constraints.br.CNPJ;

import jakarta.validation.constraints.NotBlank;

public record SupplierRequestDto(
    @NotBlank(message = "Um fornecedor precisa de um nome")
    String name,
    @CNPJ
    @NotBlank(message = "Um fornecedor precisa de um CNPJ")
    String cnpj,
@NotBlank(message = "Um fornecedor precisa de uma razão social")
    String corporateName
) {
    
}
