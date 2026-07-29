package com.example.locusverse.service;

import com.example.locusverse.database.model.AvaliacoesEntity;
import com.example.locusverse.database.model.ProdutoEntity;
import com.example.locusverse.database.model.UsuarioEntity;
import com.example.locusverse.database.repository.IAvaliacoesRepository;
import com.example.locusverse.database.repository.IProdutoRepository;
import com.example.locusverse.dto.AvaliacaoDto;
import com.example.locusverse.dto.AvaliacaoResponseDto;
import com.example.locusverse.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AvaliacoesService {

    private final IAvaliacoesRepository avaliacoesRepository;
    private final IProdutoRepository produtoRepository;

    public AvaliacaoResponseDto avaliar(UsuarioEntity usuario, UUID produtoId, AvaliacaoDto dto) {
        ProdutoEntity produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

        AvaliacoesEntity avaliacao = new AvaliacoesEntity();
        avaliacao.setUsuario(usuario);
        avaliacao.setProduto(produto);
        avaliacao.setNota(dto.nota());
        avaliacao.setComentario(dto.comentario());
        // avaliadoEm não é setado aqui de propósito: a coluna é insertable = false,
        // o Hibernate ignora qualquer valor que a gente colocar no objeto Java.

        avaliacao = avaliacoesRepository.save(avaliacao);

        atualizarMediaProduto(produto);

        return toResponseDto(avaliacao);
    }

    public List<AvaliacaoResponseDto> listarPorProduto(UUID produtoId) {
        ProdutoEntity produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

        return avaliacoesRepository.findByProduto(produto)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public void remover(UsuarioEntity usuario, Long avaliacaoId) {
        AvaliacoesEntity avaliacao = avaliacoesRepository.findById(avaliacaoId)
                .orElseThrow(() -> new NotFoundException("Avaliação não encontrada"));

        if (!avaliacao.getUsuario().getId().equals(usuario.getId())) {
            throw new AccessDeniedException("Essa avaliação não pertence a você");
        }

        ProdutoEntity produto = avaliacao.getProduto();
        avaliacoesRepository.delete(avaliacao);
        atualizarMediaProduto(produto);
    }

    // OBS: "nota" está como String na entity, então aqui a gente ASSUME que ela guarda
    // um número em formato texto (ex: "4.5") pra conseguir calcular a média. Se algum dia
    // "nota" virar comentário livre de verdade, essa conta para de fazer sentido — nesse caso
    // o certo é ter um campo numérico separado na entity (decisão de modelagem, não só de código).
    private void atualizarMediaProduto(ProdutoEntity produto) {
        List<AvaliacoesEntity> avaliacoes = avaliacoesRepository.findByProduto(produto);

        BigDecimal soma = BigDecimal.ZERO;
        int quantidadeValida = 0;

        for (AvaliacoesEntity avaliacao : avaliacoes) {
            try {
                soma = soma.add(new BigDecimal(avaliacao.getNota()));
                quantidadeValida++;
            } catch (NumberFormatException ignored) {
                // nota não numérica, não entra na média
            }
        }

        produto.setAvaliacao(quantidadeValida > 0
                ? soma.divide(BigDecimal.valueOf(quantidadeValida), 1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO);

        produtoRepository.save(produto);
    }

    private AvaliacaoResponseDto toResponseDto(AvaliacoesEntity avaliacao) {
        return new AvaliacaoResponseDto(
                avaliacao.getId(),
                avaliacao.getNota(),
                avaliacao.getComentario(),
                avaliacao.getUsuario().getNome(),
                avaliacao.getAvaliadoEm()
        );
    }
}