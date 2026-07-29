package com.example.locusverse.database.repository;

import com.example.locusverse.database.model.CarrinhoEntity;
import com.example.locusverse.database.model.ItensCarrinhoEntity;
import com.example.locusverse.database.model.ProdutoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IItensCarrinhoRepository extends JpaRepository<ItensCarrinhoEntity, Long> {

    List<ItensCarrinhoEntity> findByCarrinho(CarrinhoEntity carrinho);

    Optional<ItensCarrinhoEntity> findByCarrinhoAndProduto(CarrinhoEntity carrinho, ProdutoEntity produto);
}