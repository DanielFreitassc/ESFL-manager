package com.danielfreitassc.backend.mappers.transactions;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.danielfreitassc.backend.dtos.transactions.TransactionRequestDto;
import com.danielfreitassc.backend.dtos.transactions.TransactionResponseDto;
import com.danielfreitassc.backend.mappers.centers.CostCenterMapper;
import com.danielfreitassc.backend.models.transactions.TransactionEntity;

@Mapper(componentModel = "spring", uses = {CostCenterMapper.class})
public interface TransactionMapper {
    @Mapping(target = "expenseCategoryPt", expression = "java(transactionEntity.getExpenseCategory().getPtName())")
    @Mapping(target = "transactionStatus", expression = "java(transactionEntity.getTransactionStatus() != null ? transactionEntity.getTransactionStatus().getPtName() : null)")

    TransactionResponseDto toDto(TransactionEntity transactionEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "supplier.id", source = "supplierId")
    @Mapping(target = "costCenter.id", source = "costCenterId")
    TransactionEntity toEntity(TransactionRequestDto transactionRequestDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "supplier.id", source = "supplierId")
    @Mapping(target = "costCenter.id", source = "costCenterId")
    void toUpdate(TransactionRequestDto transactionRequestDto, @MappingTarget TransactionEntity transactionEntity);
}
