package com.example.locusverse.database.repository;

import com.example.locusverse.database.model.CategoriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ICategoriaRepository extends JpaRepository<CategoriaEntity, UUID> {

    Optional<CategoriaEntity> findByNome(String nome);
}
