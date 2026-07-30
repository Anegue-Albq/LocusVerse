package com.example.locusverse.controller;

import com.example.locusverse.dto.CategoriaDto;
import com.example.locusverse.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/categoria")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    public List<CategoriaDto> getAllCategorias() {
        return categoriaService.listarTodas();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public CategoriaDto createCategoria(@RequestBody @Valid CategoriaDto dto) {
        return categoriaService.criar(dto);
    }
}