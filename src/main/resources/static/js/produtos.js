// produtos.js — catálogo dinâmico com fetch, favoritos e carrinho via API
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

  function updateCartBadge(count) {
    var badge = document.querySelector("[data-cart-count]");
    var srCount = document.querySelector("[data-cart-count-sr]");
    if (badge) badge.textContent = String(count);
    if (srCount) srCount.textContent = count + (count === 1 ? " item no carrinho" : " itens no carrinho");
  }

  function formatPrice(value) {
    return "R$" + Number(value).toFixed(2).replace(".", ",");
  }

  function createProductCard(produto, favoritos) {
    var isFav = favoritos.some(function (f) { return f.produto.id === produto.id; });
    var favId = null;
    if (isFav) {
      var fav = favoritos.find(function (f) { return f.produto.id === produto.id; });
      favId = fav ? fav.idFavorito : null;
    }

    var li = document.createElement("li");
    li.className = "product-card";
    li.innerHTML =
      '<article>' +
        '<a class="product-card__link" href="produto.html?id=' + produto.id + '">' +
          '<img class="product-card__image" src="' + (produto.imagemUrl || '../static/assets/product-placeholder.svg') + '" alt="Imagem do produto ' + produto.nome + '" />' +
          '<h3 class="product-card__name">' + produto.nome + '</h3>' +
        '</a>' +
        '<p class="product-card__price">' +
          '<span class="product-card__price-label">A partir de:</span> ' +
          formatPrice(produto.preco) +
        '</p>' +
        '<div class="product-card__actions">' +
          '<button type="button" class="btn btn-primary btn-sm product-card__add" data-add-to-cart data-product-id="' + produto.id + '">Adicionar ao carrinho</button>' +
          '<button type="button" class="product-card__favorite" data-favorite data-product-id="' + produto.id + '" ' + (favId ? 'data-fav-id="' + favId + '"' : '') + ' aria-pressed="' + isFav + '" aria-label="' + (isFav ? 'Remover ' : 'Adicionar ') + produto.nome + (isFav ? ' dos favoritos' : ' aos favoritos') + '">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="' + (isFav ? 'currentColor' : 'none') + '" aria-hidden="true" focusable="false">' +
              '<path d="M12 20s-7-4.4-9.3-8.8C1.2 8 2.7 4.8 6 4.1c2-.4 3.8.4 5 2 1.2-1.6 3-2.4 5-2 3.3.7 4.8 3.9 3.3 7.1C19 15.6 12 20 12 20z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />' +
            '</svg>' +
          '</button>' +
        '</div>' +
      '</article>';

    return li;
  }

  async function loadProducts() {
    try {
      var response = await fetch(API_BASE + "/v1/produto");
      if (!response.ok) throw new Error("Erro ao carregar produtos");
      return await response.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function loadFavoritos() {
    if (!isLoggedIn()) return [];
    try {
      var response = await fetch(API_BASE + "/v1/favoritos", { headers: getAuthHeaders() });
      if (!response.ok) return [];
      return await response.json();
    } catch (e) {
      return [];
    }
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
      var count = data.itens ? data.itens.length : 0;
      updateCartBadge(count);
    } catch (e) {
      updateCartBadge(0);
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

  async function toggleFavorite(button) {
    if (!isLoggedIn()) {
      announce("Faça login para favoritar.");
      window.location.href = "login.html";
      return;
    }

    var produtoId = button.getAttribute("data-product-id");
    var isPressed = button.getAttribute("aria-pressed") === "true";
    var favId = button.getAttribute("data-fav-id");

    try {
      if (isPressed && favId) {
        // Remover favorito
        await fetch(API_BASE + "/v1/favoritos/" + favId, {
          method: "DELETE",
          headers: getAuthHeaders()
        });
        button.setAttribute("aria-pressed", "false");
        button.removeAttribute("data-fav-id");
        button.querySelector("svg").setAttribute("fill", "none");
        notify("Removido dos favoritos.", "success");
      } else {
        // Adicionar favorito
        var response = await fetch(API_BASE + "/v1/favoritos/" + produtoId, {
          method: "POST",
          headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error("Erro ao favoritar");
        // Recarrega favoritos pra pegar o id
        var favs = await loadFavoritos();
        var newFav = favs.find(function (f) { return String(f.produto.id) === String(produtoId); });
        button.setAttribute("aria-pressed", "true");
        if (newFav) button.setAttribute("data-fav-id", newFav.idFavorito);
        button.querySelector("svg").setAttribute("fill", "currentColor");
        notify("Adicionado aos favoritos.", "success");
      }
    } catch (e) {
      notify("Erro ao atualizar favoritos.", "error");
    }
  }

  function initEvents() {
    document.addEventListener("click", function (e) {
      var addBtn = e.target.closest("[data-add-to-cart]");
      if (addBtn) {
        var produtoId = addBtn.getAttribute("data-product-id");
        addToCart(produtoId);
        return;
      }

      var favBtn = e.target.closest("[data-favorite]");
      if (favBtn) {
        toggleFavorite(favBtn);
        return;
      }
    });
  }

  async function openFavoritesSidebar() {
    var panel = document.querySelector("[data-favorites-panel]");
    var toggle = document.querySelector("[data-favorites-toggle]");
    var list = document.querySelector("[data-favorites-list]");
    if (!panel || !list) return;

    panel.hidden = false;
    if (toggle) toggle.setAttribute("aria-expanded", "true");

    if (!isLoggedIn()) {
      list.innerHTML = '<li class="favorites-dropdown__empty">Faça login para ver seus favoritos.</li>';
      return;
    }

    list.innerHTML = '<li class="favorites-dropdown__empty">Carregando...</li>';
    var favoritos = await loadFavoritos();

    if (!favoritos.length) {
      list.innerHTML = '<li class="favorites-dropdown__empty">Você ainda não tem favoritos.</li>';
      return;
    }

    list.innerHTML = favoritos.map(function (f) {
      return "<li>" + f.produto.nome + "</li>";
    }).join("");
  }

  function closeFavoritesSidebar() {
    var panel = document.querySelector("[data-favorites-panel]");
    var toggle = document.querySelector("[data-favorites-toggle]");
    if (panel) panel.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function initFavoritesSidebar() {
    var toggle = document.querySelector("[data-favorites-toggle]");
    var panel = document.querySelector("[data-favorites-panel]");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      if (panel.hidden) openFavoritesSidebar();
      else closeFavoritesSidebar();
    });

    document.addEventListener("click", function (event) {
      if (!panel.hidden && !panel.contains(event.target) && event.target !== toggle) {
        closeFavoritesSidebar();
      }
    });
  }

  // Remove acentos/caixa pra comparação de busca mais tolerante
  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  // Máximo de produtos exibidos na seção "Conheça nossos produtos"
  var CATALOGO_LIMITE = 4;

  function renderGrids(produtos, favoritos) {
    var grids = document.querySelectorAll(".product-grid");
    if (grids.length === 0) return;

    // Primeira grid: catálogo (filtrado pela busca, se houver termo), limitado a 4 produtos
    grids[0].innerHTML = "";
    if (produtos.length === 0) {
      grids[0].innerHTML = '<li class="favorites-dropdown__empty">Nenhum produto encontrado.</li>';
    } else {
      produtos.slice(0, CATALOGO_LIMITE).forEach(function (produto) {
        grids[0].appendChild(createProductCard(produto, favoritos));
      });
    }

    // Segunda grid (lançamentos): últimos 8 produtos do catálogo filtrado
    if (grids.length > 1) {
      grids[1].innerHTML = "";
      var lancamentos = produtos.slice(-8);
      lancamentos.forEach(function (produto) {
        grids[1].appendChild(createProductCard(produto, favoritos));
      });
    }
  }

  function initSearch(getState) {
    var form = document.querySelector(".search-form");
    var input = document.getElementById("produto-busca");
    if (!form || !input) return;

    function applyFilter() {
      var termo = normalizeText(input.value);
      var state = getState();
      var filtrados = termo
        ? state.produtos.filter(function (produto) {
            return normalizeText(produto.nome).indexOf(termo) !== -1;
          })
        : state.produtos;
      renderGrids(filtrados, state.favoritos);
      announce(filtrados.length + (filtrados.length === 1 ? " produto encontrado." : " produtos encontrados."));
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      applyFilter();
    });

    input.addEventListener("input", applyFilter);
  }

  async function init() {
    var produtos = await loadProducts();
    var favoritos = await loadFavoritos();

    renderGrids(produtos, favoritos);

    loadCartCount();
    initEvents();
    initFavoritesSidebar();
    initSearch(function () {
      return { produtos: produtos, favoritos: favoritos };
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
