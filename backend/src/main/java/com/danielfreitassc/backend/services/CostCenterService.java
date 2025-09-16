package com.danielfreitassc.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.danielfreitassc.backend.dtos.centers.CostCenterRequestDto;
import com.danielfreitassc.backend.dtos.centers.CostCenterResponseDto;
import com.danielfreitassc.backend.mappers.centers.CostCenterMapper;
import com.danielfreitassc.backend.repositories.centers.CostCenterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CostCenterService {
    private final CostCenterRepository costCenterRepository;
    private final CostCenterMapper costCenterMapper;

    public CostCenterResponseDto create(CostCenterRequestDto costCenterRequestDto) {
        return costCenterMapper.toDto(costCenterRepository.save(costCenterMapper.toEntity(costCenterRequestDto)));
    }
}
