package com.danielfreitassc.backend.models.transactions;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import com.danielfreitassc.backend.models.centers.CostCenterEntity;
import com.danielfreitassc.backend.models.suppliers.SupplierEntity;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "transactions")
@Table(name = "transactions")
public class TransactionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    private int installmentNumber;
    @ManyToOne
    @JoinColumn(name = "cost_center_id")
    private CostCenterEntity costCenter;
    @Enumerated(EnumType.STRING)
    private ExpenseCategory expenseCategory;
    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private SupplierEntity supplier;
    private String notes;
    private BigDecimal amount;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dueDate;
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;
    @CreationTimestamp
    private Timestamp createdAt;
}
