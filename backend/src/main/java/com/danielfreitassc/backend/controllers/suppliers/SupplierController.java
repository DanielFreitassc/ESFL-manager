package com.danielfreitassc.backend.controllers.suppliers;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.dtos.suppliers.SupplierRequestDto;
import com.danielfreitassc.backend.dtos.suppliers.SupplierResponseDto;
import com.danielfreitassc.backend.services.suppliers.SupplierService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/suppliers")
public class SupplierController {
    private final SupplierService supplierService;

    @PostMapping
    public MessageResponseDto create(@RequestBody @Valid SupplierRequestDto supplierRequestDto) {
        
        return supplierService.create(supplierRequestDto);
    }

    @GetMapping
    public Page<SupplierResponseDto> getSuppliers(Pageable pageable) {
        return supplierService.getSuppliers(pageable);
    }

    @GetMapping("/pending")
    public Page<SupplierResponseDto> getSuppliersForApproved(Pageable pageable) {
        return supplierService.getSuppliersForApproved(pageable);
    }

    @GetMapping("/{id}")
    public SupplierResponseDto getSupplier(@PathVariable UUID id) {
        return supplierService.getSupplier(id);
    }

    @PutMapping("/{id}")
    public MessageResponseDto update(@PathVariable UUID id,@RequestBody @Valid SupplierRequestDto supplierRequestDto) {
        return supplierService.update(id, supplierRequestDto);
    }
    
    @DeleteMapping("/{id}")
    public MessageResponseDto deleteSupplier(@PathVariable UUID id) {
        return supplierService.deleteSupplier(id);
    }

    @PostMapping("/approved/{id}")
    public MessageResponseDto approvedSupplier(@PathVariable UUID id) {
        return supplierService.approvedSupplier(id);
    }
}
