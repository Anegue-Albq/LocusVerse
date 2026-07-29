package com.example.locusverse.dto;

import jakarta.validation.constraints.NotBlank;

public record FinalizarPedidoDto(
        @NotBlank String enderecoEntrega
) {}