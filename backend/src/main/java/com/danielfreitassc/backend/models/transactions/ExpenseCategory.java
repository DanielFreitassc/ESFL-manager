package com.danielfreitassc.backend.models.transactions;

public enum ExpenseCategory {
    PERSONNEL("pessoal"),
    SERVICE("servico"),
    CONSUMPTION("consumo"),
    CAPITAL("capital"),
    FOOD("merenda"),
    OPERATING("custeio");

    private final String value;

    ExpenseCategory(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }
}
