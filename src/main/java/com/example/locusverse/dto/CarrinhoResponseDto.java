package com.example.locusverse.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CarrinhoResponseDto(
        UUID id,
        String status,
        List<ItemCarrinhoResponseDto> itens,
        BigDecimal total
) {}