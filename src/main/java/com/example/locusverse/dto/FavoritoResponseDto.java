package com.example.locusverse.dto;

import java.util.UUID;

public record FavoritoResponseDto(
        UUID idFavorito,
        ProdutoResponseDto produto
) {}