package com.danielfreitassc.backend.services.users;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.dtos.users.UserRequestDto;
import com.danielfreitassc.backend.mappers.users.UserMapper;
import com.danielfreitassc.backend.models.users.UserEntity;
import com.danielfreitassc.backend.repositories.users.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


    @Transactional
    public MessageResponseDto create(UserRequestDto userRequestDto) {
        UserEntity userEntity = userMapper.toEntity(userRequestDto);
        String passwordEncoded = passwordEncoder.encode(userRequestDto.password());
        userEntity.setPassword(passwordEncoded);

        userRepository.save(userEntity);
        return new MessageResponseDto("Sua conta foi criada. Ela será ativada após a aprovação de outro administrador.");
    }

}
