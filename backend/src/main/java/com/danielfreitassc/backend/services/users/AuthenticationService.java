package com.danielfreitassc.backend.services.users;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.users.LoginRequestDto;
import com.danielfreitassc.backend.dtos.users.LoginResponseDto;
import com.danielfreitassc.backend.infra.security.TokenService;
import com.danielfreitassc.backend.models.users.UserEntity;
import com.danielfreitassc.backend.repositories.users.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    
    private static final int MAX_LOGIN_ATTEMPTS = 4;

    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final UserRepository userRepository;

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        UserEntity user = findUserOrThrow(loginRequestDto);

        validateUserStatus(user);

        if (passwordEncoder.matches(loginRequestDto.password(), user.getPassword())) {
            user.resetLoginAttempts();
            userRepository.save(user);
            String token = tokenService.generateToken(user);
            return new LoginResponseDto(token);
        } else {
            handleFailedLogin(user);
            return null;
        }
    }

    private UserEntity findUserOrThrow(LoginRequestDto dto) {
        Optional<UserEntity> user = userRepository.findByEmail(dto.email());
        if(user.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"E-mail ou senha inválidos.");
        }
        return user.get();
    }

    private void validateUserStatus(UserEntity user) {
        if (user.isAccountLocked()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"A conta está bloqueada. Tente novamente mais tarde.");
        }

        if (!user.isActive()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Sua conta ainda não está ativada.");
        }
    }

    private void handleFailedLogin(UserEntity user) {
        user.incrementLoginAttempts();

        if (user.getLoginAttempts() >= MAX_LOGIN_ATTEMPTS) {
            user.lockAccount();
        }

        userRepository.save(user);

        if (user.isAccountLocked()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Conta bloqueada por excesso de tentativas.");
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"E-mail ou senha inválidos.");
        }
    }
}
