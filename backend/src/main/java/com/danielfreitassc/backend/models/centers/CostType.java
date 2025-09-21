package com.danielfreitassc.backend.models.centers;

public enum CostType {
    OPERATING("custeio"),
    OPERATING_CAPITAL_FOOD("custeio capital e merenda"),
    OPERATING_CAPITAL("custeio capital"),
    PERSONNEL_CONSUMPTION_SERVICE_CAPITAL("pessoal consumo serviço e capital");

    private final String ptName;

    CostType(String ptName) {
        this.ptName = ptName;
    }

    public String getPtName() {
        return ptName;
    }
}
