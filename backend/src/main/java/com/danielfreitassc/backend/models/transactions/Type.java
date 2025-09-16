package com.danielfreitassc.backend.models.transactions;

public enum Type {
    INCOME("entrada"),
    EXPENSE("saida");

    private final String value;

    Type(String value) {
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
