package com.example.locusverse.service;

import com.example.locusverse.database.model.CarrinhoEntity;
import com.example.locusverse.database.model.ItensCarrinhoEntity;
import com.example.locusverse.database.model.ItensPedidoEntity;
import com.example.locusverse.database.model.PedidoEntity;
import com.example.locusverse.database.model.ProdutoEntity;
import com.example.locusverse.database.model.UsuarioEntity;
import com.example.locusverse.database.repository.ICarrinhoRepository;
import com.example.locusverse.database.repository.IItensCarrinhoRepository;
import com.example.locusverse.database.repository.IItensPedidosRepository;
import com.example.locusverse.database.repository.IPedidoRepository;
import com.example.locusverse.dto.CategoriaDto;
import com.example.locusverse.dto.FinalizarPedidoDto;
import com.example.locusverse.dto.ItemPedidoResponseDto;
import com.example.locusverse.dto.PedidoResponseDto;
import com.example.locusverse.dto.ProdutoResponseDto;
import com.example.locusverse.enums.StatusPedido;
import com.example.locusverse.exception.BadRequestException;
import com.example.locusverse.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {



    private final IPedidoRepository pedidoRepository;
    private final IItensPedidosRepository itensPedidoRepository;
    private final ICarrinhoRepository carrinhoRepository;
    private final IItensCarrinhoRepository itensCarrinhoRepository;

    @Transactional
    public PedidoResponseDto finalizarPedido(UsuarioEntity usuario, FinalizarPedidoDto dto) {
        CarrinhoEntity carrinho = carrinhoRepository.findByUsuarioAndStatus(usuario, StatusPedido.ABERTO.name())
                .orElseThrow(() -> new BadRequestException("Você não tem um carrinho aberto"));

        List<ItensCarrinhoEntity> itensCarrinho = itensCarrinhoRepository.findByCarrinho(carrinho);

        if (itensCarrinho.isEmpty()) {
            throw new BadRequestException("Carrinho vazio");
        }

        BigDecimal valorTotal = itensCarrinho.stream()
                .map(item -> item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        PedidoEntity pedido = new PedidoEntity();
        pedido.setUsuario(usuario);
        pedido.setStatus(StatusPedido.FINALIZADO.name());
        pedido.setValorTotal(valorTotal);
        pedido.setEnderecoEntrega(dto.enderecoEntrega());
        pedido = pedidoRepository.save(pedido);

        for (ItensCarrinhoEntity itemCarrinho : itensCarrinho) {
            ItensPedidoEntity itemPedido = new ItensPedidoEntity();
            itemPedido.setPedido(pedido);
            itemPedido.setProduto(itemCarrinho.getProduto());
            itemPedido.setQuantidade(itemCarrinho.getQuantidade());
            itemPedido.setPrecoUnitario(itemCarrinho.getPrecoUnitario()); // preço já travado no carrinho
            itensPedidoRepository.save(itemPedido);
        }

        carrinho.setStatus(StatusPedido.FINALIZADO.name());
        carrinhoRepository.save(carrinho);

        return montarResposta(pedido);
    }

    public List<PedidoResponseDto> listarMeusPedidos(UsuarioEntity usuario) {
        return pedidoRepository.findByUsuario(usuario)
                .stream()
                .map(this::montarResposta)
                .toList();
    }

    public PedidoResponseDto buscarPedido(UsuarioEntity usuario, Long pedidoId) {
        PedidoEntity pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new NotFoundException("Pedido não encontrado"));

        if (!pedido.getUsuario().getId().equals(usuario.getId())) {
            throw new AccessDeniedException("Esse pedido não pertence a você");
        }

        return montarResposta(pedido);
    }

    // Sem ownership check aqui de propósito: quem chama isso é admin (controle fica no @PreAuthorize do controller).
    public PedidoResponseDto atualizarStatus(Long pedidoId, String novoStatus) {
        PedidoEntity pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new NotFoundException("Pedido não encontrado"));

        pedido.setStatus(novoStatus);
        pedidoRepository.save(pedido);

        return montarResposta(pedido);
    }

    private PedidoResponseDto montarResposta(PedidoEntity pedido) {
        List<ItemPedidoResponseDto> itensDto = itensPedidoRepository.findByPedido(pedido)
                .stream()
                .map(item -> new ItemPedidoResponseDto(
                        item.getId(),
                        toProdutoResponseDto(item.getProduto()),
                        item.getQuantidade(),
                        item.getPrecoUnitario(),
                        item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade()))
                ))
                .toList();

        return new PedidoResponseDto(
                pedido.getId(),
                pedido.getStatus(),
                pedido.getValorTotal(),
                pedido.getEnderecoEntrega(),
                itensDto
        );
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