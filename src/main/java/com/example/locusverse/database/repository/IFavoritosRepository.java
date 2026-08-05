package com.example.locusverse.database.repository;

import com.example.locusverse.database.model.FavoritosEntity;
import com.example.locusverse.database.model.ProdutoEntity;
import com.example.locusverse.database.model.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface IFavoritosRepository extends JpaRepository<FavoritosEntity, UUID> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("DELETE FROM FavoritosEntity f WHERE f.usuario.id = :idUsuario AND f.idFavorito = :idFavorito")
    void deleteByUsuario_IdAndIdFavorito(
            @Param("idUsuario") UUID idUsuario,
            @Param("idFavorito") UUID idFavorito
    );

    boolean existsByUsuarioAndProduto(UsuarioEntity usuario, ProdutoEntity produto);

    List<FavoritosEntity> findByUsuario(UsuarioEntity usuario);
}