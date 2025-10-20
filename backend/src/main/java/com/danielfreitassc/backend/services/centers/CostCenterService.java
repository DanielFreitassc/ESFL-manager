package com.danielfreitassc.backend.services.centers;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.centers.CostCenterRequestDto;
import com.danielfreitassc.backend.dtos.centers.CostCenterResponseDto;
import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.mappers.centers.CostCenterMapper;
import com.danielfreitassc.backend.models.centers.CostCenterEntity;
import com.danielfreitassc.backend.repositories.centers.CostCenterRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CostCenterService {
    private final CostCenterRepository costCenterRepository;
    private final CostCenterMapper costCenterMapper;

    @Transactional
    public MessageResponseDto create(CostCenterRequestDto costCenterRequestDto) {
        CostCenterEntity costCenterEntity = costCenterMapper.toEntity(costCenterRequestDto);
        costCenterEntity.setApproved(true);

        costCenterRepository.save(costCenterEntity);

        return new MessageResponseDto("Custo cadastrado com sucesso!");
    }
     
    public Page<CostCenterResponseDto> getCosts(Pageable pageable) {
        return costCenterRepository.findByApprovedTrue(pageable).map(costCenterMapper::toDto);
    }

    public Page<CostCenterResponseDto> getForApproved(Pageable pageable) {
        return costCenterRepository.findByApprovedFalse(pageable).map(costCenterMapper::toDto);
    }

    public CostCenterResponseDto getCost(UUID id) {
        return costCenterMapper.toDto(findCostOrThrow(id));
    }

    @Transactional
    public MessageResponseDto updateCost(UUID id, CostCenterRequestDto costCenterRequestDto) {
        CostCenterEntity costCenterEntity = findCostOrThrow(id);
        costCenterMapper.toUpdate(costCenterRequestDto, costCenterEntity);
        costCenterRepository.save(costCenterEntity);
        return new MessageResponseDto("Custo atualizado com sucesso!");
    }

    public MessageResponseDto approvedCost(UUID id) {
        CostCenterEntity costCenterEntity = findCostOrThrow(id);


        costCenterEntity.setApproved(!costCenterEntity.isApproved());
        costCenterRepository.save(costCenterEntity);

        String message = costCenterEntity.isApproved() ? "Custo aprovado": "Custo cancelado";
        return new MessageResponseDto(message);
    }

    public MessageResponseDto deleteCost(UUID id) {
        costCenterRepository.delete(findCostOrThrow(id));
        return new MessageResponseDto("Custo removido com sucesso!");
    }

    public CostCenterEntity findCostOrThrow(UUID id) {
        Optional<CostCenterEntity> cost = costCenterRepository.findById(id);
        if(cost.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Custo não encontrado");
        }
        return cost.get();
    }
}
