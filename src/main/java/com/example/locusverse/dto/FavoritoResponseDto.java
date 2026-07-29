package com.example.locusverse.dto;

public record FavoritoResponseDto(
        Long idFavorito,
        ProdutoResponseDto produto
) {}