package com.danielfreitassc.backend.services.transactions;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.dtos.transactions.TransactionRequestDto;
import com.danielfreitassc.backend.dtos.transactions.TransactionResponseDto;
import com.danielfreitassc.backend.mappers.transactions.TransactionMapper;
import com.danielfreitassc.backend.models.transactions.TransactionEntity;
import com.danielfreitassc.backend.repositories.transactions.TransactionRepository;
import com.danielfreitassc.backend.services.centers.CostCenterService;
import com.danielfreitassc.backend.services.suppliers.SupplierService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final CostCenterService costCenterService;
    private final SupplierService supplierService;

    @Transactional
    public MessageResponseDto create(List<TransactionRequestDto> transactionRequestDto, boolean approved) {
        List<TransactionEntity> transactions = transactionMapper.toEntities(transactionRequestDto);

        transactions.forEach(transaction -> 
            costCenterService.findCostOrThrow(transaction.getCostCenter().getId())
        );

        transactions.forEach(transaction -> 
            supplierService.findSupplierOrThrow(transaction.getSupplier().getId())
        );

        transactions.forEach(transaction -> transaction.setApproved(!approved));

        transactionRepository.saveAll(transactions);

        return new MessageResponseDto("Transação feita com sucesso!");
    }

    public Page<TransactionResponseDto> getAllApproved(Pageable pageable) {
        return transactionRepository.findByApprovedTrue(pageable).map(transactionMapper::toDto);
    }

    public Page<TransactionResponseDto> getForApproved(Pageable pageable) {
        return transactionRepository.findByApprovedFalse(pageable).map(transactionMapper::toDto);
    }

    public MessageResponseDto approved(UUID id) {
        TransactionEntity transactionEntity = findTransactionOrThrow(id);
        transactionEntity.setApproved(!transactionEntity.isApproved());
        transactionRepository.save(transactionEntity);
        String message = (transactionEntity.isApproved()) ? "Transação aprovada" : "Transação recusada";
        return new MessageResponseDto(message);
    }

    public TransactionResponseDto getTransaction(UUID id) {
        return transactionMapper.toDto(findTransactionOrThrow(id));
    }

    @Transactional
    public MessageResponseDto updateTransaction(UUID id, TransactionRequestDto transactionRequestDto) {
        TransactionEntity transactionEntity = findTransactionOrThrow(id);

        transactionMapper.toUpdate(transactionRequestDto, transactionEntity);
        transactionRepository.save(transactionEntity);

        return new MessageResponseDto("Transação atualizada com sucesso");
    }

    public MessageResponseDto deleteTransaction(UUID id) {
        transactionRepository.delete(findTransactionOrThrow(id));
        return new MessageResponseDto("Transação removida");
    }

    private TransactionEntity findTransactionOrThrow(UUID id) {
        Optional<TransactionEntity> transaction = transactionRepository.findById(id);
        if(transaction.isEmpty())  {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Transacação não encontrada");
        }

        return transaction.get();
    }
}
