package com.danielfreitassc.backend.models.transactions;

public enum TransactionType {
    INCOME("entrada"),
    EXPENSE("saida");

    private final String ptName;

    TransactionType(String ptName) {
        this.ptName = ptName;
    }

    public String getPtName() {
        return ptName;
    }
}
