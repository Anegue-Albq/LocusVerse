package com.example.locusverse.controller;

import com.example.locusverse.database.model.UsuarioEntity;
import com.example.locusverse.dto.AvaliacaoDto;
import com.example.locusverse.dto.AvaliacaoResponseDto;
import com.example.locusverse.service.AvaliacoesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/avaliacoes")
public class AvaliacoesController {

    private final AvaliacoesService avaliacoesService;

    @GetMapping("/produto/{produtoId}")
    public List<AvaliacaoResponseDto> listarPorProduto(@PathVariable UUID produtoId) {
        return avaliacoesService.listarPorProduto(produtoId);
    }

    @PostMapping("/produto/{produtoId}")
    public AvaliacaoResponseDto avaliar(
            @AuthenticationPrincipal UsuarioEntity usuario,
            @PathVariable UUID produtoId,
            @RequestBody @Valid AvaliacaoDto dto
    ) {
        return avaliacoesService.avaliar(usuario, produtoId, dto);
    }

    @DeleteMapping("/{avaliacaoId}")
    public void remover(
            @AuthenticationPrincipal UsuarioEntity usuario,
            @PathVariable Long avaliacaoId
    ) {
        avaliacoesService.remover(usuario, avaliacaoId);
    }
}