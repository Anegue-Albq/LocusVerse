package com.example.locusverse.controller;

import com.example.locusverse.database.model.UsuarioEntity;
import com.example.locusverse.dto.FavoritoResponseDto;
import com.example.locusverse.service.FavoritosService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/favoritos")
public class FavoritosController {

    private final FavoritosService favoritosService;

    @GetMapping
    public List<FavoritoResponseDto> listar(@AuthenticationPrincipal UsuarioEntity usuario) {
        return favoritosService.listar(usuario);
    }

    @PostMapping("/{produtoId}")
    public void adicionar(
            @AuthenticationPrincipal UsuarioEntity usuario,
            @PathVariable UUID produtoId
    ) {
        favoritosService.adicionar(usuario, produtoId);
    }

    @DeleteMapping("/{idFavorito}")
    public void remover(
            @AuthenticationPrincipal UsuarioEntity usuario,
            @PathVariable Long idFavorito
    ) {
        favoritosService.remover(usuario, idFavorito);
    }
}