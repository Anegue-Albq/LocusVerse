package com.example.locusverse.controller;

import com.example.locusverse.database.model.UsuarioEntity;
import com.example.locusverse.dto.FinalizarPedidoDto;
import com.example.locusverse.dto.PedidoResponseDto;
import com.example.locusverse.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/pedido")
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping("/checkout")
    public PedidoResponseDto checkout(
            @AuthenticationPrincipal UsuarioEntity usuario,
            @RequestBody @Valid FinalizarPedidoDto dto
    ) {
        return pedidoService.finalizarPedido(usuario, dto);
    }

    @GetMapping
    public List<PedidoResponseDto> listarMeusPedidos(@AuthenticationPrincipal UsuarioEntity usuario) {
        return pedidoService.listarMeusPedidos(usuario);
    }

    @GetMapping("/{pedidoId}")
    public PedidoResponseDto buscarPedido(
            @AuthenticationPrincipal UsuarioEntity usuario,
            @PathVariable Long pedidoId
    ) {
        return pedidoService.buscarPedido(usuario, pedidoId);
    }

    // Sem @AuthenticationPrincipal aqui de propósito: quem chama é admin mexendo no
    // pedido de outra pessoa, então não faz sentido comparar contra o usuário logado.
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{pedidoId}/status")
    public PedidoResponseDto atualizarStatus(
            @PathVariable Long pedidoId,
            @RequestParam String novoStatus
    ) {
        return pedidoService.atualizarStatus(pedidoId, novoStatus);
    }
}