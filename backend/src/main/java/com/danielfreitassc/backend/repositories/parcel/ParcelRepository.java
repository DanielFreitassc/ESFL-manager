package com.danielfreitassc.backend.repositories.parcel;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.parcel.ParcelEntity;

public interface ParcelRepository extends JpaRepository<ParcelEntity, UUID> {
    List<ParcelEntity> findAllByAvailableBetween(LocalDate start, LocalDate end);
}

