package com.example.locusverse.repository;

import com.example.locusverse.database.model.RolesEntity;

import java.util.Optional;

public interface IRolesRepository {

    Optional<RolesEntity> findByNome(String nome);
}
