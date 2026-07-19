package com.example.locusverse.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

public record RegisterRequestDto(
        @NotBlank String nome,
        @NotBlank String email,
        @NotBlank String senha) {
}
