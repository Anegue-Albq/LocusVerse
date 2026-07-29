package com.example.locusverse.database.repository;

import com.example.locusverse.database.model.FavoritosEntity;
import com.example.locusverse.database.model.ProdutoEntity;
import com.example.locusverse.database.model.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IFavoritosRepository extends JpaRepository<FavoritosEntity, Long> {

    boolean existsByUsuarioAndProduto(UsuarioEntity usuario, ProdutoEntity produto);

    List<FavoritosEntity> findByUsuario(UsuarioEntity usuario);
}