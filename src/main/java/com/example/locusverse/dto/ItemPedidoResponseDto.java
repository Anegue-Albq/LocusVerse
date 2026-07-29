package com.example.locusverse.dto;

import java.math.BigDecimal;

public record ItemPedidoResponseDto(
        Long id,
        ProdutoResponseDto produto,
        Integer quantidade,
        BigDecimal precoUnitario,
        BigDecimal subtotal
) {}