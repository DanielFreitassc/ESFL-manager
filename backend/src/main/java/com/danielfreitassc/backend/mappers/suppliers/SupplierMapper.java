package com.danielfreitassc.backend.mappers.suppliers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.danielfreitassc.backend.dtos.suppliers.SupplierRequestDto;
import com.danielfreitassc.backend.dtos.suppliers.SupplierResponseDto;
import com.danielfreitassc.backend.models.suppliers.SupplierEntity;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    SupplierResponseDto toDto(SupplierEntity supplierEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "approved", ignore = true)
    SupplierEntity toEntity(SupplierRequestDto supplierRequestDto);

    List<SupplierEntity> toEntities(List<SupplierRequestDto> supplierRequestDtos);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "approved", ignore = true)
    void toUpdate(SupplierRequestDto supplierRequestDto, @MappingTarget SupplierEntity supplierEntity);
}
