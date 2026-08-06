package com.example.locusverse.service;

import com.example.locusverse.database.model.CarrinhoEntity;
import com.example.locusverse.database.model.ItensCarrinhoEntity;
import com.example.locusverse.database.model.ProdutoEntity;
import com.example.locusverse.database.model.UsuarioEntity;
import com.example.locusverse.database.repository.ICarrinhoRepository;
import com.example.locusverse.database.repository.IItensCarrinhoRepository;
import com.example.locusverse.database.repository.IProdutoRepository;
import com.example.locusverse.dto.CarrinhoItemDto;
import com.example.locusverse.dto.CarrinhoResponseDto;
import com.example.locusverse.dto.CategoriaDto;
import com.example.locusverse.dto.ItemCarrinhoResponseDto;
import com.example.locusverse.dto.ProdutoResponseDto;
import com.example.locusverse.enums.StatusPedido;
import com.example.locusverse.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarrinhoService {


    private final ICarrinhoRepository carrinhoRepository;
    private final IItensCarrinhoRepository itensCarrinhoRepository;
    private final IProdutoRepository produtoRepository;

    // Busca o carrinho aberto do usuário, ou cria um novo se ele ainda não tiver.
    private CarrinhoEntity obterCarrinhoAberto(UsuarioEntity usuario) {
        return carrinhoRepository.findByUsuarioAndStatus(usuario, StatusPedido.ABERTO.name())
                .orElseGet(() -> {
                    CarrinhoEntity novoCarrinho = new CarrinhoEntity();
                    novoCarrinho.setUsuario(usuario);
                    novoCarrinho.setStatus(StatusPedido.ABERTO.name());
                    return carrinhoRepository.save(novoCarrinho);
                });
    }

    public CarrinhoResponseDto adicionarItem(UsuarioEntity usuario, CarrinhoItemDto dto) {
        CarrinhoEntity carrinho = obterCarrinhoAberto(usuario);

        ProdutoEntity produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

        ItensCarrinhoEntity item = itensCarrinhoRepository
                .findByCarrinhoAndProduto(carrinho, produto)
                .orElse(null);

        if (item != null) {
            item.setQuantidade(item.getQuantidade() + dto.quantidade());
        } else {
            item = new ItensCarrinhoEntity();
            item.setCarrinho(carrinho);
            item.setProduto(produto);
            item.setQuantidade(dto.quantidade());
            item.setPrecoUnitario(produto.getPreco()); // preço copiado agora, não lido depois
        }

        itensCarrinhoRepository.save(item);

        return montarResposta(carrinho);
    }

    public CarrinhoResponseDto listarCarrinho(UsuarioEntity usuario) {
        CarrinhoEntity carrinho = obterCarrinhoAberto(usuario);
        return montarResposta(carrinho);
    }

    public void removerItem(UsuarioEntity usuario, UUID itemId) {
        ItensCarrinhoEntity item = itensCarrinhoRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Item não encontrado"));

        if (!item.getCarrinho().getUsuario().getId().equals(usuario.getId())) {
            throw new AccessDeniedException("Esse item não pertence ao seu carrinho");
        }

        itensCarrinhoRepository.delete(item);
    }

    public CarrinhoResponseDto atualizarQuantidade(UsuarioEntity usuario, UUID itemId, Integer novaQuantidade) {
        ItensCarrinhoEntity item = itensCarrinhoRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Item não encontrado"));

        if (!item.getCarrinho().getUsuario().getId().equals(usuario.getId())) {
            throw new AccessDeniedException("Esse item não pertence ao seu carrinho");
        }

        item.setQuantidade(novaQuantidade);
        itensCarrinhoRepository.save(item);

        return montarResposta(item.getCarrinho());
    }

    private CarrinhoResponseDto montarResposta(CarrinhoEntity carrinho) {
        List<ItemCarrinhoResponseDto> itensDto = itensCarrinhoRepository.findByCarrinho(carrinho)
                .stream()
                .map(item -> new ItemCarrinhoResponseDto(
                        item.getId(),
                        toProdutoResponseDto(item.getProduto()),
                        item.getQuantidade(),
                        item.getPrecoUnitario(),
                        item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade()))
                ))
                .toList();

        BigDecimal total = itensDto.stream()
                .map(ItemCarrinhoResponseDto::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CarrinhoResponseDto(carrinho.getId(), carrinho.getStatus(), itensDto, total);
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