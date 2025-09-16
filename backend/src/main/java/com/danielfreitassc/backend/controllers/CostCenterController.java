package com.danielfreitassc.backend.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.centers.CostCenterRequestDto;
import com.danielfreitassc.backend.dtos.centers.CostCenterResponseDto;
import com.danielfreitassc.backend.services.CostCenterService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/costs")
@RequiredArgsConstructor
public class CostCenterController {
    private final CostCenterService costCenterService;

    @PostMapping
    public CostCenterResponseDto create(@RequestBody @Valid CostCenterRequestDto costCenterRequestDto) {
        return costCenterService.create(costCenterRequestDto);
    }
}
