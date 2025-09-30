package com.danielfreitassc.backend.controllers.users;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.dtos.users.UserRequestDto;
import com.danielfreitassc.backend.dtos.users.UserResponseDto;
import com.danielfreitassc.backend.services.users.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @PostMapping
    public MessageResponseDto create(@RequestBody @Valid UserRequestDto userRequestDto) {
        return userService.create(userRequestDto);
    }
    
    @GetMapping
    public Page<UserResponseDto> getAllApproved(Pageable pageable) {
        return userService.getAllApproved(pageable);
    }

    @GetMapping("/pending")
    public Page<UserResponseDto> getToApproved(Pageable pageable) {
        return userService.getToApproved(pageable);
    }
    
    @PostMapping("/{id}/active")
    public MessageResponseDto approved(@PathVariable UUID id) {
        return userService.approved(id);
    }
}
