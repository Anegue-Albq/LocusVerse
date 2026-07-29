package com.example.locusverse.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CarrinhoItemDto(
        @NotNull UUID produtoId,
        @NotNull @Min(1) Integer quantidade
) {}