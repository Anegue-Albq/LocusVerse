package com.example.locusverse.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AtualizarQuantidadeDto(
        @NotNull @Min(1) Integer quantidade
) {}