package com.danielfreitassc.backend.repositories.users;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.danielfreitassc.backend.models.users.UserEntity;
import com.danielfreitassc.backend.models.users.UserRole;


public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Page<UserEntity> findAllByActiveFalse(Pageable pageable);
    Page<UserEntity> findAllByActiveTrue(Pageable pageable);
    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findById(UUID id);

    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.role = :role")
    long countByRole(UserRole role);
}
