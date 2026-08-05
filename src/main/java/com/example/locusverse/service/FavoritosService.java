package com.example.locusverse.service;

import com.example.locusverse.database.model.FavoritosEntity;
import com.example.locusverse.database.model.ProdutoEntity;
import com.example.locusverse.database.model.UsuarioEntity;
import com.example.locusverse.database.repository.IFavoritosRepository;
import com.example.locusverse.database.repository.IProdutoRepository;
import com.example.locusverse.database.repository.IUsuarioRepository;
import com.example.locusverse.dto.CategoriaDto;
import com.example.locusverse.dto.FavoritoResponseDto;
import com.example.locusverse.dto.ProdutoResponseDto;
import com.example.locusverse.exception.BadRequestException;
import com.example.locusverse.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FavoritosService {

    private final IFavoritosRepository favoritosRepository;
    private final IUsuarioRepository usuarioRepository;
    private final IProdutoRepository produtoRepository;

    public void adicionar(UsuarioEntity usuario, UUID produtoId) {
        ProdutoEntity produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

        if (favoritosRepository.existsByUsuarioAndProduto(usuario, produto)) {
            throw new BadRequestException("Produto já está nos favoritos");
        }

        FavoritosEntity favorito = new FavoritosEntity();
        favorito.setUsuario(usuario);
        favorito.setProduto(produto);

        favoritosRepository.save(favorito);
    }

    public List<FavoritoResponseDto> listar(UsuarioEntity usuario) {
        return favoritosRepository.findByUsuario(usuario)
                .stream()
                .map(favorito -> new FavoritoResponseDto(
                        favorito.getIdFavorito(),
                        toProdutoResponseDto(favorito.getProduto())
                ))
                .toList();
    }

    @Transactional
    public void removerFavorito(UsuarioEntity usuario, UUID idFavorito) {
        favoritosRepository.deleteByUsuario_IdAndIdFavorito(usuario.getId(), idFavorito);
    }

    private ProdutoResponseDto toProdutoResponseDto(ProdutoEntity produto) {
        return new ProdutoResponseDto(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getImagemUrl(),
                produto.getAvaliacao(),
                new CategoriaDto(produto.getCategoria().getId(), produto.getCategoria().getNome())
        );
    }
}