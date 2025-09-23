package com.danielfreitassc.backend.mappers.transactions;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.danielfreitassc.backend.dtos.transactions.TransactionRequestDto;
import com.danielfreitassc.backend.dtos.transactions.TransactionResponseDto;
import com.danielfreitassc.backend.models.transactions.TransactionEntity;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    TransactionResponseDto toDto(TransactionEntity transactionEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "approved", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "supplier.id", source = "supplierId")
    @Mapping(target = "costCenter.id", source = "costCenterId")
    TransactionEntity toEntity(TransactionRequestDto transactionRequestDto);
    
    List<TransactionEntity> toEntities(List<TransactionRequestDto> transactionRequestDtos);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "approved", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "supplier.id", source = "supplierId")
    @Mapping(target = "costCenter.id", source = "costCenterId")
    void toUpdate(TransactionRequestDto transactionRequestDto, @MappingTarget TransactionEntity transactionEntity);
}
