package com.example.locusverse.repository;

import com.example.locusverse.database.model.ProdutoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IProdutoRepository extends JpaRepository<ProdutoEntity, Long> {
}
