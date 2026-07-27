package com.example.locusverse.service;

import com.example.locusverse.database.model.CategoriaEntity;
import com.example.locusverse.database.repository.ICategoriaRepository;
import com.example.locusverse.dto.CategoriaDto;
import com.example.locusverse.exception.BadRequestException;
import com.example.locusverse.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final ICategoriaRepository categoriaRepository;

    public List<CategoriaDto> listAll() {
        return categoriaRepository.findAll().stream()
                .map(c -> new CategoriaDto(c.getId(), c.getNome()))
                .toList();
    }

    public CategoriaDto create(String nome) {
        if (categoriaRepository.findByNome(nome).isPresent()) {
            throw new BadRequestException("Categoria já existe com este nome");
        }
        CategoriaEntity saved = categoriaRepository.save(CategoriaEntity.builder()
                        .nome(nome)
                        .build());
        return new CategoriaDto(saved.getId(), saved.getNome());
    }

    @Transactional
    public CategoriaDto rename(UUID id, String novoNome) {
        CategoriaEntity categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));
        categoria.setNome(novoNome);
        categoriaRepository.save(categoria);

        return new CategoriaDto(categoria.getId(), categoria.getNome());
    }

    public void delete(UUID id) {
        CategoriaEntity categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));
        categoriaRepository.delete(categoria);
    }
}
