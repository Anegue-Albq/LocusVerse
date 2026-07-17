package com.example.locusverse.database.dto;

import com.example.locusverse.database.model.CategoriaEntity;
import com.example.locusverse.enums.CategoriaEnum;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Builder
public record ProdutoDto (
        @NotBlank
        @Size(max = 100)
        String nome,

        String descricao,

        @NotNull
        @DecimalMin(value = "0.0", inclusive = true) @Digits(integer = 8, fraction = 2)
        BigDecimal preco,

        String imagemUrl,

        @NotBlank
        String categoria
) {}
