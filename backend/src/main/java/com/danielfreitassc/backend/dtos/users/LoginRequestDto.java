package com.danielfreitassc.backend.dtos.users;

import com.danielfreitassc.backend.configurations.OnCreate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record LoginRequestDto(
    @NotBlank(message = "Email é necessário")
    @Pattern(groups = OnCreate.class, regexp = "^(?=.*@)(?=.*\\.).+$", message = "Email deve conter '@' e '.'")
    String email,
    @NotBlank(message = "Senha é necessária")
    String password
) {
    
}
