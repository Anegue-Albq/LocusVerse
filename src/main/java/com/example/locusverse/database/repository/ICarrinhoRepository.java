package com.example.locusverse.database.repository;

import com.example.locusverse.database.model.CarrinhoEntity;
import com.example.locusverse.database.model.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ICarrinhoRepository extends JpaRepository<CarrinhoEntity, Long> {

    Optional<CarrinhoEntity> findByUsuarioAndStatus(UsuarioEntity usuario, String status);
}