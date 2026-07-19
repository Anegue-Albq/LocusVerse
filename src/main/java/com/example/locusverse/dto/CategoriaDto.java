package com.example.locusverse.dto;

import java.util.UUID;

public record CategoriaDto(
        UUID id,
        String nome
        // TODO: ADD 'Long quantidadeProdutos' AND CREATE A NEW QUERY METHOD IN ICategoriaRepository
) {}