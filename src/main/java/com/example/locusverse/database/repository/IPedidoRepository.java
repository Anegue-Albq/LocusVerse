package com.example.locusverse.database.repository;

import com.example.locusverse.database.model.PedidoEntity;
import com.example.locusverse.database.model.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPedidoRepository extends JpaRepository<PedidoEntity, Long> {

    List<PedidoEntity> findByUsuario(UsuarioEntity usuario);
}