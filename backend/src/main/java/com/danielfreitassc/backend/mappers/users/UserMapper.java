package com.danielfreitassc.backend.mappers.users;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.danielfreitassc.backend.dtos.users.UserRequestDto;
import com.danielfreitassc.backend.dtos.users.UserResponseDto;
import com.danielfreitassc.backend.models.users.UserEntity;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDto toDto(UserEntity userEntity);
    

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "loginAttempts", ignore = true)
    @Mapping(target = "lockoutExpiration", ignore = true)
    UserEntity toEntity(UserRequestDto userRequestDto);
    
}
