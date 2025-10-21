package com.danielfreitassc.backend.services.suppliers;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.dtos.suppliers.SupplierRequestDto;
import com.danielfreitassc.backend.dtos.suppliers.SupplierResponseDto;
import com.danielfreitassc.backend.mappers.suppliers.SupplierMapper;
import com.danielfreitassc.backend.models.suppliers.SupplierEntity;
import com.danielfreitassc.backend.repositories.suppliers.SupplierRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper; 

    @Transactional
    public MessageResponseDto create(SupplierRequestDto supplierRequestDtos) {
        
        findCnpj(supplierRequestDtos.cnpj());
        
        supplierRepository.save(supplierMapper.toEntity(supplierRequestDtos));

        return new MessageResponseDto("Fornecedor cadastrados com sucesso!");
    }

    public Page<SupplierResponseDto> getSuppliers(Pageable pageable) {
        return supplierRepository.findAll(pageable).map(supplierMapper::toDto);
    }

    @Transactional
    public MessageResponseDto update(UUID id, SupplierRequestDto supplierRequestDto) {
        SupplierEntity supplierEntity = findSupplierOrThrow(id);
        findCnpj(supplierRequestDto.cnpj());


        supplierMapper.toUpdate(supplierRequestDto, supplierEntity);

        supplierRepository.save(supplierEntity);

        return new MessageResponseDto("Fornecedor atualizado");
    }

    public SupplierResponseDto getSupplier(UUID id) {
        return supplierMapper.toDto(findSupplierOrThrow(id));
    }

    public MessageResponseDto deleteSupplier(UUID id) {
        supplierRepository.delete(findSupplierOrThrow(id));
        return new MessageResponseDto("Fornecedor removido com sucesso");
    }

    public void findCnpj(String cnpj) {
        if(supplierRepository.findByCnpj(cnpj).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"CNPJ já cadastrado");
        }
    }

    public SupplierEntity findSupplierOrThrow(UUID id) {
        Optional<SupplierEntity> supplier = supplierRepository.findById(id);
        if(supplier.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Fornecedor não encontrado");
        }
        return supplier.get();
    }
}
