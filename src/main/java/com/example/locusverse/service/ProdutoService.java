package com.example.locusverse.service;

import com.example.locusverse.database.dto.ProdutoDto;
import com.example.locusverse.database.model.CategoriaEntity;
import com.example.locusverse.database.model.ProdutoEntity;
import com.example.locusverse.exception.NotFoundException;
import com.example.locusverse.repository.ICategoriaRepository;
import com.example.locusverse.repository.IProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final IProdutoRepository produtoRepository;
    private final ICategoriaRepository categoriaRepository;

    public void createProduct(ProdutoDto produtoDto) {
        CategoriaEntity categoria = categoriaRepository.findByNome(produtoDto.categoria())
                .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));

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


    public void removeProduct(Long productId) {
        produtoRepository.deleteById(productId);
    }

    public List<ProdutoEntity> listAll() {return produtoRepository.findAll();} // TEMPORARY
}
