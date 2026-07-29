package com.example.locusverse.database.repository;

import com.example.locusverse.database.model.ItensPedidoEntity;
import com.example.locusverse.database.model.PedidoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IItensPedidosRepository extends JpaRepository<ItensPedidoEntity, Long> {

    List<ItensPedidoEntity> findByPedido(PedidoEntity pedido);
}