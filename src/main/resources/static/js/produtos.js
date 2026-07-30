// produtos.js — catálogo, busca, favoritos e carrinho no catálogo
(function () {
  "use strict";

  var CART_KEY = "locusverso:cart-items";
  var products = window.LocusVerseCatalog || [];

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  }

  function getCartItems() {
    try {
      return JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function setCartItems(items) {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    var badge = document.querySelector("[data-cart-count]");
    var srCount = document.querySelector("[data-cart-count-sr]");
    var quantity = items.reduce(function (total, item) { return total + item.quantity; }, 0);
    if (badge) badge.textContent = String(quantity);
    if (srCount) srCount.textContent = quantity + (quantity === 1 ? " item no carrinho" : " itens no carrinho");
  }

  function announce(message) {
    var region = document.querySelector("[data-live-region]");
    if (region) {
      region.textContent = message;
    }
  }

  function renderProducts(filteredProducts) {
    var grid = document.querySelector(".product-grid");
    var legacyLaunches = document.getElementById("titulo-lancamentos");
    if (!grid) return;

    if (legacyLaunches) {
      legacyLaunches.closest("section").remove();
    }

    grid.innerHTML = filteredProducts.map(function (product) {
      return '<li class="product-card"><article>' +
        '<a class="product-card__link" href="produto.html?id=' + product.id + '">' +
        '<img class="product-card__image" src="' + product.imagem + '" alt="Imagem do produto ' + product.nome + '">' +
        '<h2 class="product-card__name">' + product.nome + '</h2></a>' +
        '<p class="product-card__rating" aria-label="Avaliação: 5 de 5 estrelas"><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span></p>' +
        '<p class="product-card__price"><span class="product-card__price-label">' + product.categoria + '</span>' + formatCurrency(product.preco) + '</p>' +
        '<div class="product-card__actions"><button type="button" class="btn btn-primary btn-sm product-card__add" data-add-to-cart="' + product.id + '">Adicionar ao carrinho</button>' +
        '<button type="button" class="product-card__favorite" data-favorite="' + product.id + '" aria-pressed="false" aria-label="Adicionar ' + product.nome + ' aos favoritos">&#9825;</button></div>' +
        '</article></li>';
    }).join("") || '<li class="catalog-empty">Nenhum produto encontrado.</li>';
  }

  function addProductToCart(productId) {
    var product = products.find(function (item) { return item.id === productId; });
    var items = getCartItems();
    var existing = items.find(function (item) { return item.id === productId; });
    if (existing) existing.quantity += 1;
    else items.push({ id: product.id, name: product.nome, price: product.preco, image: product.imagem, quantity: 1 });
    setCartItems(items);
    announce(product.nome + " adicionado ao carrinho.");
  }

  function initCatalogInteractions() {
    document.querySelector(".product-grid").addEventListener("click", function (event) {
      var addButton = event.target.closest("[data-add-to-cart]");
      var favoriteButton = event.target.closest("[data-favorite]");
      if (addButton) addProductToCart(addButton.getAttribute("data-add-to-cart"));
      if (favoriteButton) {
        var isPressed = favoriteButton.getAttribute("aria-pressed") === "true";
        var product = products.find(function (item) { return item.id === favoriteButton.getAttribute("data-favorite"); });
        favoriteButton.setAttribute("aria-pressed", String(!isPressed));
        favoriteButton.setAttribute("aria-label", (isPressed ? "Adicionar " : "Remover ") + product.nome + (isPressed ? " aos favoritos" : " dos favoritos"));
        favoriteButton.textContent = isPressed ? "♡" : "♥";
        announce(product.nome + (isPressed ? " removido dos favoritos." : " adicionado aos favoritos."));
      }
    });
  }

  function initSearch() {
    var form = document.querySelector(".search-form");
    var input = document.getElementById("produto-busca");
    if (!form || !input) return;
    function filterProducts() {
      var term = input.value.trim().toLocaleLowerCase("pt-BR");
      var filtered = products.filter(function (product) {
        return (product.nome + " " + product.categoria).toLocaleLowerCase("pt-BR").includes(term);
      });
      renderProducts(filtered);
      announce(filtered.length + " produtos encontrados.");
    }
    form.addEventListener("submit", function (event) { event.preventDefault(); filterProducts(); });
    input.addEventListener("input", filterProducts);
  }

  document.addEventListener("DOMContentLoaded", function () {
    setCartItems(getCartItems());
    renderProducts(products);
    initCatalogInteractions();
    initSearch();
  });
})();
