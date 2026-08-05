package com.example.locusverse.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ItemPedidoResponseDto(
        UUID id,
        ProdutoResponseDto produto,
        Integer quantidade,
        BigDecimal precoUnitario,
        BigDecimal subtotal
) {}