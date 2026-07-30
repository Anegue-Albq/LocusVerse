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

  function updateCartCount(items) {
    var count = items.reduce(function (total, item) { return total + item.quantity; }, 0);
    var badge = document.querySelector("[data-cart-count]");
    var screenReaderCount = document.querySelector("[data-cart-count-sr]");
    if (badge) badge.textContent = String(count);
    if (screenReaderCount) screenReaderCount.textContent = count + (count === 1 ? " item no carrinho" : " itens no carrinho");
  }

  function renderProduct() {
    var productId = new URLSearchParams(window.location.search).get("id");
    var product = products.find(function (item) { return item.id === productId; });
    var container = document.querySelector("[data-product-detail]");
    var status = document.querySelector("[data-live-region]");
    if (!container) return;

    if (!product) {
      container.innerHTML = '<p class="product-detail__empty">Produto não encontrado. <a href="produtos.html">Voltar ao catálogo</a></p>';
      return;
    }

    document.title = product.nome + " - LocusVerso";
    container.innerHTML = '<img class="product-detail__image" src="' + product.imagem + '" alt="Imagem do produto ' + product.nome + '">' +
      '<div class="product-detail__content"><p class="product-detail__category">' + product.categoria + '</p>' +
      '<h1>' + product.nome + '</h1><p class="product-detail__description">' + product.descricao + '</p>' +
      '<p class="product-detail__price">' + formatCurrency(product.preco) + '</p>' +
      '<button type="button" class="btn btn-primary" data-add-detail>Adicionar ao carrinho</button></div>';

    container.querySelector("[data-add-detail]").addEventListener("click", function () {
      var items = getCartItems();
      var existing = items.find(function (item) { return item.id === product.id; });
      if (existing) existing.quantity += 1;
      else items.push({ id: product.id, name: product.nome, price: product.preco, image: product.imagem, quantity: 1 });
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
      updateCartCount(items);
      if (status) status.textContent = product.nome + " adicionado ao carrinho.";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateCartCount(getCartItems());
    renderProduct();
  });
})();