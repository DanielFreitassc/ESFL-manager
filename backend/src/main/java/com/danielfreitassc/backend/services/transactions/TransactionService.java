package com.danielfreitassc.backend.services.transactions;

import java.math.BigDecimal;
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
import com.danielfreitassc.backend.dtos.transactions.TransactionViewDto;
import com.danielfreitassc.backend.mappers.transactions.TransactionMapper;
import com.danielfreitassc.backend.models.transactions.TransactionEntity;
import com.danielfreitassc.backend.models.transactions.TransactionType;
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
    public MessageResponseDto create(TransactionRequestDto transactionRequestDto) {
        TransactionEntity transaction = transactionMapper.toEntity(transactionRequestDto);

        costCenterService.findCostOrThrow(transaction.getCostCenter().getId());

        supplierService.findSupplierOrThrow(transaction.getSupplier().getId());

        transactionRepository.save(transaction);

        return new MessageResponseDto("Transação feita com sucesso!");
    }

    public TransactionViewDto getToIncome() {
        List<TransactionEntity> transactionEntities = transactionRepository.findAllByType(TransactionType.INCOME);
        
        BigDecimal totalAmount  = transactionEntities.stream().map(TransactionEntity::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        
        return new TransactionViewDto(TransactionType.INCOME.getPtName(),totalAmount);
    }

    public TransactionViewDto getToExpense() {
        List<TransactionEntity> transactionEntities = transactionRepository.findAllByType(TransactionType.EXPENSE);

        BigDecimal totalAmount = transactionEntities.stream().map(TransactionEntity::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        return new TransactionViewDto(TransactionType.EXPENSE.getPtName(),totalAmount);
    }

    public TransactionViewDto getRealAmount() {
        List<TransactionEntity> income = transactionRepository.findAllByType(TransactionType.INCOME);
        List<TransactionEntity> expense = transactionRepository.findAllByType(TransactionType.EXPENSE);

        BigDecimal amountIncome =  income.stream().map(TransactionEntity::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal amountExpense =  expense.stream().map(TransactionEntity::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal amount = amountIncome.subtract(amountExpense);
        return new TransactionViewDto("Saldo real", amount);
    }

    public Page<TransactionResponseDto> getAll(Pageable pageable) {
        return transactionRepository.findAll(pageable).map(transactionMapper::toDto);
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
