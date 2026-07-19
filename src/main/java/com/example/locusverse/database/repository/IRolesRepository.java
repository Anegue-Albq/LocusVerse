package com.example.locusverse.database.repository;

import com.example.locusverse.database.model.RolesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IRolesRepository extends JpaRepository<RolesEntity, Long> {

    Optional<RolesEntity> findByNome(String nome);
}
