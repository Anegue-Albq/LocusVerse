package com.example.locusverse.database.repository;

import com.example.locusverse.database.model.RolesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface IRolesRepository extends JpaRepository<RolesEntity, UUID> {

    Optional<RolesEntity> findByNome(String nome);
}
