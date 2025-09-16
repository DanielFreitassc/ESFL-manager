package com.danielfreitassc.backend.repositories.centers;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.centers.CostCenterEntity;

public interface CostCenterRepository extends JpaRepository<CostCenterEntity, UUID> {
    
}
