-- Tabela Usuario
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela Categoria
CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Tabela Carrinho
CREATE TABLE carrinho (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuario(id),
    status VARCHAR(20),
    taxa NUMERIC(10,2)
);

-- Tabela Produto
CREATE TABLE produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    imagem_url TEXT,
    avaliacao NUMERIC(2,1),
    id_categoria INTEGER REFERENCES categoria(id)
);

-- Tabela Favoritos
CREATE TABLE favoritos (
    id_favorito SERIAL PRIMARY KEY,
    id_produto INTEGER REFERENCES produto(id),
    id_usuario INTEGER REFERENCES usuario(id)
);

-- Tabela Itens_Carrinho
CREATE TABLE itens_carrinho (
    id SERIAL PRIMARY KEY,
    id_carrinho INTEGER REFERENCES carrinho(id),
    id_produto INTEGER REFERENCES produto(id),
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL
);

-- Tabela pedido
CREATE TABLE pedido (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuario(id),
    status VARCHAR(30),
    valor_total NUMERIC(10,2),
    endereco_entrega TEXT
);

-- Tabela itens_pedido
CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    id_pedido INTEGER REFERENCES pedido(id),
    id_produto INTEGER REFERENCES produto(id),
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL
);

-- Tabela avaliações
CREATE TABLE avaliacoes (
    id SERIAL PRIMARY KEY,
    id_produto INTEGER REFERENCES produto(id),
    id_usuario INTEGER REFERENCES usuario(id),
    nota VARCHAR(150),
    comentario TEXT,
    avaliado_em TIMESTAMP DEFAULT NOW()
);