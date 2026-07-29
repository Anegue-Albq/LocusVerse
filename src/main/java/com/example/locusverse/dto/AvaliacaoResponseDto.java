package com.example.locusverse.dto;

import java.time.LocalDateTime;

public record AvaliacaoResponseDto(
        Long id,
        String nota,
        String comentario,
        String usuarioNome,
        LocalDateTime avaliadoEm
) {}