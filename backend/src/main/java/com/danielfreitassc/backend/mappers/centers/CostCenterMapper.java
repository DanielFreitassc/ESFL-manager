package com.danielfreitassc.backend.mappers.centers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.danielfreitassc.backend.dtos.centers.CostCenterRequestDto;
import com.danielfreitassc.backend.dtos.centers.CostCenterResponseDto;
import com.danielfreitassc.backend.models.centers.CostCenterEntity;

@Mapper(componentModel = "spring")
public interface CostCenterMapper {
   @Mapping(target = "type", expression = "java(costCenterEntity.getType().getPtName())")
   @Mapping(target = "select", source = "type")
   CostCenterResponseDto toDto(CostCenterEntity costCenterEntity);
   
   @Mapping(target = "id", ignore = true)
   CostCenterEntity toEntity(CostCenterRequestDto costCenterRequestDto);

   @Mapping(target = "id", ignore = true)
   void toUpdate(CostCenterRequestDto centerRequestDto,@MappingTarget CostCenterEntity centerEntity);


   List<CostCenterResponseDto> toDtoList(List<CostCenterEntity> costCenterEntity);
   List<CostCenterEntity> toEntityList(List<CostCenterRequestDto> costCenterRequestDtos);
   void toUpdateEntityList(List<CostCenterRequestDto> costCenterRequestDtos,@MappingTarget List<CostCenterEntity> costCenterEntities);
}
