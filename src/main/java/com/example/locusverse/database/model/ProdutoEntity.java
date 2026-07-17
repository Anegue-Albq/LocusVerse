package com.example.locusverse.database.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
//@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Builder
@Table(name = "produto")
public class ProdutoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;
    @Column(columnDefinition = "TEXT")
    private String descricao;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;
    @Column(name = "imagem_url")
    private String imagemUrl;
    @Column(precision = 2, scale = 1)
    private BigDecimal avaliacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria")
    private CategoriaEntity categoria;
}