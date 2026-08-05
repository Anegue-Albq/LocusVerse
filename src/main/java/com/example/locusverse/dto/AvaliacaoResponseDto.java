package com.example.locusverse.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AvaliacaoResponseDto(
        UUID id,
        String nota,
        String comentario,
        String usuarioNome,
        LocalDateTime avaliadoEm
) {}