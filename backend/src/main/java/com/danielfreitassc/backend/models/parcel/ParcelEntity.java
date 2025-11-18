package com.danielfreitassc.backend.models.parcel;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity(name = "parcels")
@Table(name = "parcels")
@NoArgsConstructor
@AllArgsConstructor
public class ParcelEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private ParcelDestination destination;
    private BigDecimal amount;
    private LocalDate available;
    @CreationTimestamp
    private Timestamp createdAt;
}
