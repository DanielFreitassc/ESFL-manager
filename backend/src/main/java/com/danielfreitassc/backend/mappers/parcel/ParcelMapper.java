package com.danielfreitassc.backend.mappers.parcel;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.danielfreitassc.backend.dtos.parcel.ParcelRequestDto;
import com.danielfreitassc.backend.dtos.parcel.ParcelResponseDto;
import com.danielfreitassc.backend.models.parcel.ParcelEntity;

@Mapper(componentModel = "spring")
public interface ParcelMapper {
    ParcelResponseDto toDto(ParcelEntity parcelEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    ParcelEntity toEntity(ParcelRequestDto parcelRequestDto);
    

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void toUpdate(ParcelRequestDto parcelRequestDto, @MappingTarget ParcelEntity parcelEntity);
}
