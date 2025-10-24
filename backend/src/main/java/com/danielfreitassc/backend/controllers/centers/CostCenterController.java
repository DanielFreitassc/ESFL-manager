package com.danielfreitassc.backend.controllers.centers;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.centers.CostCenterRequestDto;
import com.danielfreitassc.backend.dtos.centers.CostCenterResponseDto;
import com.danielfreitassc.backend.dtos.centers.CostCenterSelectDto;
import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.services.centers.CostCenterService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/costs")
@RequiredArgsConstructor
public class CostCenterController {
    private final CostCenterService costCenterService;

    @PostMapping
    public MessageResponseDto create(@RequestBody @Valid CostCenterRequestDto costCenterRequestDto) {
        
        return costCenterService.create(costCenterRequestDto);
    }

    @GetMapping
    public Page<CostCenterResponseDto> getCosts(Pageable pageable) {
        return costCenterService.getCosts(pageable);
    }

    @GetMapping("/list")
    public List<CostCenterSelectDto> select() {
        return costCenterService.select();
    }

    @GetMapping("/{id}")
    public CostCenterResponseDto getCost(@PathVariable UUID id) {
        return costCenterService.getCost(id);
    }

    @PutMapping("/{id}")
    public MessageResponseDto updateCost(@PathVariable UUID id,@RequestBody @Valid CostCenterRequestDto costCenterRequestDto) {
        return costCenterService.updateCost(id, costCenterRequestDto);
    }

    @DeleteMapping("/{id}")
    public MessageResponseDto deleteCost(@PathVariable UUID id) {
        return costCenterService.deleteCost(id);
    }
}
