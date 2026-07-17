package com.example.locusverse.controller;

import com.example.locusverse.database.dto.ProdutoDto;
import com.example.locusverse.database.model.ProdutoEntity;
import com.example.locusverse.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/produto")
public class ProdutoController {

    private final ProdutoService produtoService;

    @GetMapping
    public List<ProdutoEntity> getAllProducts() { // TEMPORARY
        return produtoService.listAll();
    }

    @PostMapping
    public void createProduct(@RequestBody @Valid ProdutoDto produtoDto) {
        produtoService.createProduct(produtoDto);
    }
}
