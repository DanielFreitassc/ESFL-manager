package com.danielfreitassc.backend.models.transactions;

public enum TransactionStatus {
    PROJECTION("projecao"),
    COMPLETED("efetuado");

    private final String ptName;

    TransactionStatus(String ptName) {
        this.ptName = ptName;
    }

    public String getPtName() {
        return ptName;
    }
}
