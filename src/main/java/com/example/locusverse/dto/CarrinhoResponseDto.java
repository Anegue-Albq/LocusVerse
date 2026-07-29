package com.example.locusverse.dto;

import java.math.BigDecimal;
import java.util.List;

public record CarrinhoResponseDto(
        Long id,
        String status,
        List<ItemCarrinhoResponseDto> itens,
        BigDecimal total
) {}