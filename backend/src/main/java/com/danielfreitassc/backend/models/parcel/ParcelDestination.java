package com.danielfreitassc.backend.models.parcel;

public enum ParcelDestination {
    EDUCATION("Educação"),
    SHELTER("Abrigos"),
    CHILD("Serviço de Convivência e Fortalecimento de Vínculos"),
    MOTHERS("Clube de mães"),
    AGED("Idoso");

    private String destination;

    ParcelDestination(String destination) {
        this.destination = destination;
    }
 
    public String getDestination() {
        return destination;
    }

}
