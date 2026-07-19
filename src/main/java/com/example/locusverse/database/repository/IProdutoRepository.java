package com.example.locusverse.database.repository;

import com.example.locusverse.database.model.ProdutoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface IProdutoRepository extends JpaRepository<ProdutoEntity, UUID> {
}
