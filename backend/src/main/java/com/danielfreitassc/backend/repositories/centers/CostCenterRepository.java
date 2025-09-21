package com.danielfreitassc.backend.repositories.centers;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.centers.CostCenterEntity;

public interface CostCenterRepository extends JpaRepository<CostCenterEntity, UUID> {
 
    Page<CostCenterEntity> findByApprovedTrue(Pageable pageable);

    Page<CostCenterEntity> findByApprovedFalse(Pageable pageable);
}
