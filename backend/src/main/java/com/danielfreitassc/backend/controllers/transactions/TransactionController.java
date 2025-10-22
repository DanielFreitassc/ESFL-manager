package com.danielfreitassc.backend.controllers.transactions;

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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.common.MessageResponseDto;
import com.danielfreitassc.backend.dtos.transactions.TransactionCategoryDto;
import com.danielfreitassc.backend.dtos.transactions.TransactionRequestDto;
import com.danielfreitassc.backend.dtos.transactions.TransactionResponseDto;
import com.danielfreitassc.backend.dtos.transactions.TransactionViewDto;
import com.danielfreitassc.backend.models.transactions.ExpenseCategory;
import com.danielfreitassc.backend.services.transactions.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/transactions")
public class TransactionController {
    private final TransactionService transactionService;
    
    @PostMapping
    public MessageResponseDto create(@RequestBody @Valid TransactionRequestDto transactionRequestDto) {
        return transactionService.create(transactionRequestDto);
    }

    @GetMapping("/income")
    public TransactionViewDto getToIncome() {
        return transactionService.getToIncome();
    }

    @GetMapping("/expense")
    public TransactionViewDto getToExpense()  {
        return transactionService.getToExpense();
    }

    @GetMapping("/real-amount")
    public TransactionViewDto getRealAmount() {
        return transactionService.getRealAmount();
    }

    @GetMapping
    public Page<TransactionResponseDto> getAll(Pageable pageable) {
        return transactionService.getAll(pageable);
    }

    @GetMapping("/{id}")
    public TransactionResponseDto getTransaction(@PathVariable UUID id) {
        return transactionService.getTransaction(id);
    }


    @PutMapping("/{id}")
    public MessageResponseDto updateTransaction(@PathVariable UUID id,@RequestBody @Valid TransactionRequestDto transactionRequestDto) {
        return transactionService.updateTransaction(id, transactionRequestDto);
    }

    @DeleteMapping("/{id}")
    public MessageResponseDto deleteTransaction(@PathVariable UUID id) {
        return transactionService.deleteTransaction(id);
    }

    @GetMapping("/personnel")
    public TransactionCategoryDto getRevenuePersonal() {
        return transactionService.getRevenue(ExpenseCategory.PERSONNEL, "Salários, encargos e benefícios");
    }

    @GetMapping("/service")
    public TransactionCategoryDto getRevenueService() {
        return transactionService.getRevenue(ExpenseCategory.SERVICE, "Terceirizados, consultorias, manutenção");
    }

    @GetMapping("/consumption")
    public TransactionCategoryDto getRevenueConsumption() {
        return transactionService.getRevenue(ExpenseCategory.CONSUMPTION, "Material escolar, energia, água");
    }

    @GetMapping("/food")
    public TransactionCategoryDto getRevenueFood() {
        return transactionService.getRevenue(ExpenseCategory.FOOD, "Alimentação escolar e lanches");
    }

    @GetMapping("/operationg")
    public TransactionCategoryDto getRevenueOperationg() {
        return transactionService.getRevenue(ExpenseCategory.OPERATING, "Despesas necessárias para manter o funcionamento.");
    }
}
