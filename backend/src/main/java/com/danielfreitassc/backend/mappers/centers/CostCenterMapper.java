package com.danielfreitassc.backend.mappers.centers;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.danielfreitassc.backend.dtos.centers.CostCenterRequestDto;
import com.danielfreitassc.backend.dtos.centers.CostCenterResponseDto;
import com.danielfreitassc.backend.models.centers.CostCenterEntity;

@Mapper(componentModel = "spring")
public interface CostCenterMapper {
   CostCenterResponseDto toDto(CostCenterEntity costCenterEntity);

   CostCenterEntity toEntity(CostCenterRequestDto costCenterRequestDto);

   void toUpdate(CostCenterRequestDto centerRequestDto,@MappingTarget CostCenterEntity centerEntity);
}
