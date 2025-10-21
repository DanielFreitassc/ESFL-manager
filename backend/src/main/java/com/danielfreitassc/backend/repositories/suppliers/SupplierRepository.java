package com.danielfreitassc.backend.repositories.suppliers;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danielfreitassc.backend.models.suppliers.SupplierEntity;

public interface SupplierRepository extends JpaRepository<SupplierEntity, UUID> {
    Optional<SupplierEntity> findByCnpj(String cnpj);

    List<SupplierEntity> findAllByCnpjIn(List<String> cnpjs);
}
