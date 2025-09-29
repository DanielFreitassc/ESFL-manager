package com.danielfreitassc.backend.controllers.users;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.users.LoginRequestDto;
import com.danielfreitassc.backend.dtos.users.LoginResponseDto;
import com.danielfreitassc.backend.services.users.AuthenticationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/login")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping
    public LoginResponseDto login(@RequestBody @Valid LoginRequestDto loginRequestDto) {
        return authenticationService.login(loginRequestDto);
    }  
}
