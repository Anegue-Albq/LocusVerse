(function () {
  "use strict";

  var API_BASE = "";

  function getAuthHeaders() {
    if (window.LocusAuth) return window.LocusAuth.getAuthHeaders();
    var token = window.localStorage.getItem("locusverso:token");
    var headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = "Bearer " + token;
    return headers;
  }

  function isLoggedIn() {
    if (window.LocusAuth) return window.LocusAuth.isLoggedIn();
    return !!window.localStorage.getItem("locusverso:token");
  }

  function announce(message) {
    var region = document.querySelector("[data-live-region]");
    if (region) region.textContent = message;
  }

  function notify(message, variant) {
    if (window.LocusToast) window.LocusToast.show(message, { variant: variant });
    announce(message);
  }

  function formatPrice(value) {
    return "R$" + Number(value).toFixed(2).replace(".", ",");
  }

  function updateCartBadge(count) {
    var badge = document.querySelector("[data-cart-count]");
    var srCount = document.querySelector("[data-cart-count-sr]");
    if (badge) badge.textContent = String(count);
    if (srCount) srCount.textContent = count + (count === 1 ? " item no carrinho" : " itens no carrinho");
  }

  function renderStars(value) {
    var rounded = Math.round(Number(value) || 0);
    var stars = "";
    for (var i = 1; i <= 5; i++) {
      stars += i <= rounded ? "★" : "☆";
    }
    return stars;
  }

  function escapeHtml(value) {
    var map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) { return map[char]; });
  }

  async function loadCartCount() {
    if (!isLoggedIn()) {
      updateCartBadge(0);
      return;
    }
    try {
      var response = await fetch(API_BASE + "/v1/carrinho", { headers: getAuthHeaders() });
      if (!response.ok) {
        updateCartBadge(0);
        return;
      }
      var data = await response.json();
      updateCartBadge(data.itens ? data.itens.length : 0);
    } catch (e) {
      updateCartBadge(0);
    }
  }

  async function loadProduct(produtoId) {
    try {
      var response = await fetch(API_BASE + "/v1/produto");
      if (!response.ok) throw new Error("Erro ao carregar produtos");
      var produtos = await response.json();
      return produtos.find(function (item) { return String(item.id) === String(produtoId); }) || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function loadAvaliacoes(produtoId) {
    try {
      var response = await fetch(API_BASE + "/v1/avaliacoes/produto/" + produtoId);
      if (!response.ok) throw new Error("Erro ao carregar avaliações");
      return await response.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function addToCart(produtoId) {
    if (!isLoggedIn()) {
      announce("Faça login para adicionar ao carrinho.");
      window.location.href = "login.html";
      return;
    }
    try {
      var response = await fetch(API_BASE + "/v1/carrinho/item", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ produtoId: produtoId, quantidade: 1 })
      });
      if (!response.ok) throw new Error("Erro ao adicionar ao carrinho");
      var data = await response.json();
      updateCartBadge(data.itens ? data.itens.length : 0);
      notify("Produto adicionado ao carrinho.", "success");
    } catch (e) {
      notify("Erro ao adicionar ao carrinho.", "error");
    }
  }

  async function submitAvaliacao(produtoId, nota, comentario) {
    var response = await fetch(API_BASE + "/v1/avaliacoes/produto/" + produtoId, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ nota: nota, comentario: comentario })
    });
    if (!response.ok) throw new Error("Erro ao enviar avaliação");
    return response.json();
  }

  function renderProduct(produto) {
    var container = document.querySelector("[data-product-detail]");
    if (!container) return;

    document.title = produto.nome + " - LocusVerso";
    var mediaAvaliacao = produto.avaliacao != null ? Number(produto.avaliacao) : 0;
    var categoriaNome = produto.categoria ? produto.categoria.nome : "";

    container.innerHTML =
      '<img class="product-detail__image" src="' + (produto.imagemUrl || "assets/product-placeholder.svg") + '" alt="Imagem do produto ' + produto.nome + '">' +
      '<div class="product-detail__content">' +
        (categoriaNome ? '<p class="product-detail__category">' + categoriaNome + "</p>" : "") +
        "<h1>" + produto.nome + "</h1>" +
        '<p class="product-detail__rating" aria-label="Avaliação média: ' + mediaAvaliacao.toFixed(1) + ' de 5">' +
          '<span aria-hidden="true">' + renderStars(mediaAvaliacao) + "</span> " + mediaAvaliacao.toFixed(1) + "/5" +
        "</p>" +
        '<p class="product-detail__description">' + produto.descricao + "</p>" +
        '<p class="product-detail__price">' + formatPrice(produto.preco) + "</p>" +
        '<button type="button" class="btn btn-primary" data-add-detail>Adicionar ao carrinho</button>' +
      "</div>";

    container.querySelector("[data-add-detail]").addEventListener("click", function () {
      addToCart(produto.id);
    });
  }

  function renderReviewForm() {
    var estrelas = [5, 4, 3, 2, 1].map(function (valor) {
      return (
        '<input type="radio" id="nota-' + valor + '" name="nota" value="' + valor + '" />' +
        '<label for="nota-' + valor + '" title="' + valor + ' de 5">' +
          '<span class="sr-only">' + valor + ' de 5</span>' +
        "</label>"
      );
    }).join("");

    return (
      '<form class="review-form" data-review-form>' +
        '<h2 class="product-reviews__title">Deixe sua avaliação</h2>' +
        '<fieldset class="review-form__rating-field">' +
          "<legend>Sua nota</legend>" +
          '<div class="star-rating" data-star-rating>' + estrelas + "</div>" +
        "</fieldset>" +
        '<div class="field">' +
          '<label for="review-comentario">Comentário (opcional)</label>' +
          '<textarea id="review-comentario" name="comentario" rows="3" maxlength="500"></textarea>' +
        "</div>" +
        '<button type="submit" class="btn btn-primary">Enviar avaliação</button>' +
      "</form>"
    );
  }

  function attachReviewForm(produtoId, onSubmitted) {
    var form = document.querySelector("[data-review-form]");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!isLoggedIn()) {
        announce("Faça login para avaliar este produto.");
        window.location.href = "login.html";
        return;
      }

      var notaInput = form.querySelector('input[name="nota"]:checked');
      if (!notaInput) {
        announce("Selecione uma nota de 1 a 5 antes de enviar.");
        return;
      }

      var comentario = form.querySelector("#review-comentario").value.trim();
      var submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;

      try {
        await submitAvaliacao(produtoId, notaInput.value, comentario);
        notify("Avaliação enviada com sucesso!", "success");
        await onSubmitted();
      } catch (e) {
        notify("Erro ao enviar avaliação. Tente novamente.", "error");
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  function renderAvaliacoes(avaliacoes, produtoId) {
    var container = document.querySelector("[data-product-reviews]");
    if (!container) return;

    var listaHtml;
    if (!avaliacoes.length) {
      listaHtml = '<h2 class="product-reviews__title">Avaliações</h2><p class="product-reviews__empty">Ainda não há avaliações para este produto.</p>';
    } else {
      var itens = avaliacoes.map(function (avaliacao, index) {
        var nota = Number(avaliacao.nota) || 0;
        return (
          '<li class="review-item">' +
            '<p class="review-item__header">' +
              '<span class="review-item__index">' + (index + 1) + ". </span>" +
              '<span class="review-item__nota" aria-label="Nota ' + nota + ' de 5">' + renderStars(nota) + " " + nota + "/5</span>" +
            "</p>" +
            (avaliacao.usuarioNome ? '<p class="review-item__autor">' + escapeHtml(avaliacao.usuarioNome) + "</p>" : "") +
            (avaliacao.comentario ? '<p class="review-item__comentario">' + escapeHtml(avaliacao.comentario) + "</p>" : "") +
          "</li>"
        );
      }).join("");
      listaHtml = '<h2 class="product-reviews__title">Avaliações (' + avaliacoes.length + ')</h2><ol class="review-list">' + itens + "</ol>";
    }

    container.innerHTML = renderReviewForm() + '<div class="review-list-wrapper">' + listaHtml + "</div>";

    attachReviewForm(produtoId, async function () {
      var atualizadas = await loadAvaliacoes(produtoId);
      renderAvaliacoes(atualizadas, produtoId);
      var produtoAtualizado = await loadProduct(produtoId);
      if (produtoAtualizado) renderProduct(produtoAtualizado, produtoId);
    });
  }

  async function init() {
    var produtoId = new URLSearchParams(window.location.search).get("id");
    var detailContainer = document.querySelector("[data-product-detail]");

    loadCartCount();

    if (!produtoId) {
      if (detailContainer) detailContainer.innerHTML = '<p class="product-detail__empty">Produto não encontrado. <a href="produtos.html">Voltar ao catálogo</a></p>';
      return;
    }

    var produto = await loadProduct(produtoId);
    if (!produto) {
      if (detailContainer) detailContainer.innerHTML = '<p class="product-detail__empty">Produto não encontrado. <a href="produtos.html">Voltar ao catálogo</a></p>';
      return;
    }

    renderProduct(produto);
    var avaliacoes = await loadAvaliacoes(produtoId);
    renderAvaliacoes(avaliacoes, produtoId);
  }

  document.addEventListener("DOMContentLoaded", init);
})();