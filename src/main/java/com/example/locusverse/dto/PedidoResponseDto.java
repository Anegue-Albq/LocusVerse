package com.example.locusverse.dto;

import java.math.BigDecimal;
import java.util.List;

public record PedidoResponseDto(
        Long id,
        String status,
        BigDecimal valorTotal,
        String enderecoEntrega,
        List<ItemPedidoResponseDto> itens
) {}