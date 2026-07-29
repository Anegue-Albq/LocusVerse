package com.example.locusverse.service;

import com.example.locusverse.database.model.CategoriaEntity;
import com.example.locusverse.database.repository.ICategoriaRepository;
import com.example.locusverse.dto.CategoriaDto;
import com.example.locusverse.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final ICategoriaRepository categoriaRepository;

    public CategoriaDto criar(CategoriaDto dto) {
        categoriaRepository.findByNome(dto.nome())
                .ifPresent(categoriaExistente -> {
                    throw new BadRequestException("Categoria já existe");
                });

        CategoriaEntity categoria = categoriaRepository.save(
                CategoriaEntity.builder()
                        .nome(dto.nome())
                        .build()
        );

        return new CategoriaDto(categoria.getId(), categoria.getNome());
    }

    public List<CategoriaDto> listarTodas() {
        return categoriaRepository.findAll()
                .stream()
                .map(categoria -> new CategoriaDto(categoria.getId(), categoria.getNome()))
                .toList();
    }
}