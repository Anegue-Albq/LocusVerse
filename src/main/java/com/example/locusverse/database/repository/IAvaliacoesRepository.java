package com.example.locusverse.database.repository;

import com.example.locusverse.database.model.AvaliacoesEntity;
import com.example.locusverse.database.model.ProdutoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IAvaliacoesRepository extends JpaRepository<AvaliacoesEntity, Long> {

    List<AvaliacoesEntity> findByProduto(ProdutoEntity produto);
}