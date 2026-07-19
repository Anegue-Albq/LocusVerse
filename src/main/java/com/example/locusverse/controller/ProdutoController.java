package com.example.locusverse.controller;

import com.example.locusverse.dto.ProdutoDto;
import com.example.locusverse.database.model.ProdutoEntity;
import com.example.locusverse.dto.ProdutoResponseDto;
import com.example.locusverse.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/produto")
public class ProdutoController {

    private final ProdutoService produtoService;

    @GetMapping
    public List<ProdutoResponseDto> getAllProducts() {
        return produtoService.listAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public void createProduct(@RequestBody @Valid ProdutoDto produtoDto) {
        produtoService.createProduct(produtoDto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{idProduto}")
    public ProdutoResponseDto updateProduct(
            @PathVariable UUID idProduto,
            @RequestBody @Valid ProdutoDto dto
    ) {
        return produtoService.updateProduct(idProduto, dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{idProduto}")
    public void deleteProduct(@PathVariable UUID idProduto) {
        produtoService.deleteProduct(idProduto);
    }
}
