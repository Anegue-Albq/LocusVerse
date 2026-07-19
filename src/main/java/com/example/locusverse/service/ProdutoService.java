package com.example.locusverse.service;

import com.example.locusverse.dto.CategoriaDto;
import com.example.locusverse.dto.ProdutoDto;
import com.example.locusverse.database.model.CategoriaEntity;
import com.example.locusverse.database.model.ProdutoEntity;
import com.example.locusverse.dto.ProdutoResponseDto;
import com.example.locusverse.enums.CategoriaEnum;
import com.example.locusverse.exception.NotFoundException;
import com.example.locusverse.database.repository.ICategoriaRepository;
import com.example.locusverse.database.repository.IProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final IProdutoRepository produtoRepository;
    private final ICategoriaRepository categoriaRepository;

    public void createProduct(ProdutoDto produtoDto) {
        // TODO: se não existir, cria a categoria, coloca como OUTROS, ou retorna que não foi encontrada??
        CategoriaEntity categoria = categoriaRepository.findByNome(produtoDto.categoria())
                .orElseGet(() -> categoriaRepository.save(CategoriaEntity.builder()
                        .nome(produtoDto.categoria())
                        .build()
                ));

        produtoRepository.save(ProdutoEntity.builder()
                .nome(produtoDto.nome())
                .descricao(produtoDto.descricao())
                .preco(produtoDto.preco())
                .imagemUrl(produtoDto.imagemUrl())
                .categoria(categoria)
                .avaliacao(BigDecimal.ZERO)
                .build()
        );
    }

    @Transactional
    public ProdutoResponseDto updateProduct(UUID productId, ProdutoDto dto) {
        ProdutoEntity produto = produtoRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));
        CategoriaEntity categoria = categoriaRepository.findByNome(dto.categoria())
                .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));

        produto.setNome(dto.nome());
        produto.setDescricao(dto.descricao());
        produto.setImagemUrl(dto.imagemUrl());
        produto.setPreco(dto.preco());
        produto.setCategoria(categoria);

        produtoRepository.save(produto);

        return new ProdutoResponseDto(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getImagemUrl(),
                produto.getAvaliacao(),
                new CategoriaDto(categoria.getId(), categoria.getNome())
        );
    }

    public void deleteProduct(UUID productId) {
        ProdutoEntity produto = produtoRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

        produtoRepository.delete(produto);
    }

    public List<ProdutoResponseDto> listAll() {
        List<ProdutoEntity> produtos = produtoRepository.findAll();

        return produtos.stream()
                .map(produto -> new ProdutoResponseDto(
                        produto.getId(),
                        produto.getNome(),
                        produto.getDescricao(),
                        produto.getPreco(),
                        produto.getImagemUrl(),
                        produto.getAvaliacao(),
                        new CategoriaDto(
                                produto.getCategoria().getId(),
                                produto.getCategoria().getNome()
                        )
                ))
                .toList();
    }
}
