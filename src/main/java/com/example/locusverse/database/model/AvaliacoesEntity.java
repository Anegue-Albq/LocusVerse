package com.example.locusverse.database.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "avaliacoes")
public class AvaliacoesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produto")
    private ProdutoEntity produto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private UsuarioEntity usuario;

    @Column(length = 150)
    private String nota;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "avaliado_em", insertable = false, updatable = false)
    private LocalDateTime avaliadoEm;
}