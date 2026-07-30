package com.example.locusverse.controller;

import com.example.locusverse.database.model.UsuarioEntity;
import com.example.locusverse.dto.AtualizarQuantidadeDto;
import com.example.locusverse.dto.CarrinhoItemDto;
import com.example.locusverse.dto.CarrinhoResponseDto;
import com.example.locusverse.service.CarrinhoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/carrinho")
public class CarrinhoController {

    private final CarrinhoService carrinhoService;

    @GetMapping
    public CarrinhoResponseDto getCarrinho(@AuthenticationPrincipal UsuarioEntity usuario) {
        System.out.println(usuario);
        return carrinhoService.listarCarrinho(usuario);
    }

    @PostMapping("/item")
    public CarrinhoResponseDto adicionarItem(
            @AuthenticationPrincipal UsuarioEntity usuario,
            @RequestBody @Valid CarrinhoItemDto dto
    ) {
        return carrinhoService.adicionarItem(usuario, dto);
    }

    @PutMapping("/item/{itemId}")
    public CarrinhoResponseDto atualizarQuantidade(
            @AuthenticationPrincipal UsuarioEntity usuario,
            @PathVariable Long itemId,
            @RequestBody @Valid AtualizarQuantidadeDto dto
    ) {
        return carrinhoService.atualizarQuantidade(usuario, itemId, dto.quantidade());
    }

    @DeleteMapping("/item/{itemId}")
    public void removerItem(
            @AuthenticationPrincipal UsuarioEntity usuario,
            @PathVariable Long itemId
    ) {
        carrinhoService.removerItem(usuario, itemId);
    }
}