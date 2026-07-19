package com.example.locusverse.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProdutoResponseDto (
        UUID id,
        String nome,
        String descricao,
        BigDecimal preco,
        String imagemUrl,
        BigDecimal avaliacao,
        CategoriaDto categoria
) {}