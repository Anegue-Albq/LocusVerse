# LocusVerso ☄️🌌

![Logo LocusVerso](logoLocusVerso.png)

Aplicação para catálogo e compra de action figures colecionáveis, composta por uma API Java com Spring Boot e páginas web responsivas.

## Tecnologias

- Java 17
- Spring Boot 4.1
- Spring Security e JWT
- Spring Data JPA
- PostgreSQL
- HTML, CSS e JavaScript

## Requisitos

- JDK 17 ou superior
- PostgreSQL em execução
- Node.js, somente para abrir as páginas estáticas com Live Server

## Configuração

Crie um arquivo `.env` na raiz do projeto com as credenciais do banco e a chave JWT:

## Executando a aplicação

No Windows, execute:

```powershell
.\mvnw.cmd spring-boot:run
```

A aplicação iniciará em `http://localhost:8082`.

Para executar os testes:

```powershell
.\mvnw.cmd test
```

## Páginas estáticas

Para visualizar somente o frontend com Live Server:

```powershell
npx --yes live-server src/main/resources --port=5500 --no-browser
```

Com o servidor iniciado, acesse:

- `http://127.0.0.1:5500/template/index.html`
- `http://127.0.0.1:5500/template/produtos.html`
- `http://127.0.0.1:5500/template/carrinho.html`
- `http://127.0.0.1:5500/template/login.html`
- `http://127.0.0.1:5500/template/cadastro.html`
- `http://127.0.0.1:5500/template/suporte.html`

## Acessibilidade

As páginas incluem navegação por teclado, foco visível, texto alternativo em imagens, controles com rótulos acessíveis e um modo de paleta alternativa para pessoas com daltonismo.

As pontuações do Lighthouse, executadas em 29/07/2026, estão registradas em [lighthouse-report.md](lighthouse-report.md).