package com.example.locusverse.dto;

import jakarta.validation.constraints.NotBlank;

public record AvaliacaoDto(
        @NotBlank String nota,
        String comentario
) {}