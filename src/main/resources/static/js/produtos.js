// ==========================================================================
// produtos.js — favoritar produto e adicionar ao carrinho no catálogo
// ==========================================================================
(function () {
  "use strict";

  var CART_KEY = "locusverso:cart-items";

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
    if (badge) badge.textContent = String(items.length);
    if (srCount) srCount.textContent = items.length + (items.length === 1 ? " item no carrinho" : " itens no carrinho");
  }

  function announce(message) {
    var region = document.querySelector("[data-live-region]");
    if (region) {
      region.textContent = message;
    }
  }

  function initFavorites() {
    document.querySelectorAll("[data-favorite]").forEach(function (button) {
      button.addEventListener("click", function () {
        var isPressed = button.getAttribute("aria-pressed") === "true";
        var productName = button.closest(".product-card").querySelector(".product-card__name").textContent.trim();

        button.setAttribute("aria-pressed", String(!isPressed));
        button.setAttribute("aria-label", (!isPressed ? "Remover " : "Adicionar ") + productName + (!isPressed ? " dos favoritos" : " aos favoritos"));
        announce(productName + (!isPressed ? " adicionado aos favoritos." : " removido dos favoritos."));
      });
    });
  }

  function initAddToCart() {
    document.querySelectorAll("[data-add-to-cart]").forEach(function (button) {
      button.addEventListener("click", function () {
        var productName = button.closest(".product-card").querySelector(".product-card__name").textContent.trim();
        var items = getCartItems();
        items.push({ name: productName, quantity: 1 });
        setCartItems(items);
        announce(productName + " adicionado ao carrinho.");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setCartItems(getCartItems());
    initFavorites();
    initAddToCart();
  });
})();
