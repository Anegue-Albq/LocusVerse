package com.example.locusverse.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record PedidoResponseDto(
        UUID id,
        String status,
        BigDecimal valorTotal,
        String enderecoEntrega,
        List<ItemPedidoResponseDto> itens
) {}