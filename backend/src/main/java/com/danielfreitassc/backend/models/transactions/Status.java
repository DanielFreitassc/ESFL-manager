package com.danielfreitassc.backend.models.transactions;

public enum Status {
    PROJECTION("projecao"),
    COMPLETED("efetuado");

    private final String value;

    Status(String value) {
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
