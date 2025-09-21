package com.danielfreitassc.backend.models.transactions;

public enum ExpenseCategory {
    PERSONNEL("pessoal"),
    SERVICE("servico"),
    CONSUMPTION("consumo"),
    CAPITAL("capital"),
    FOOD("merenda"),
    OPERATING("custeio");

    private final String ptName;

    ExpenseCategory(String ptName) {
        this.ptName = ptName;
    }

    public String getPtName() {
        return ptName;
    }
}
