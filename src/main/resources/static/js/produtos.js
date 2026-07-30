// ==========================================================================
// produtos.js — favoritar produto e adicionar ao carrinho no catálogo
// ==========================================================================
(function () {
  "use strict";

  var CART_KEY = "locusverso:cart-count";

  function getCartCount() {
    return parseInt(window.localStorage.getItem(CART_KEY) || "0", 10);
  }

  function setCartCount(value) {
    window.localStorage.setItem(CART_KEY, String(value));
    var badge = document.querySelector("[data-cart-count]");
    var srCount = document.querySelector("[data-cart-count-sr]");
    if (badge) badge.textContent = String(value);
    if (srCount) srCount.textContent = value + (value === 1 ? " item no carrinho" : " itens no carrinho");
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
        setCartCount(getCartCount() + 1);
        announce(productName + " adicionado ao carrinho.");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setCartCount(getCartCount());
    initFavorites();
    initAddToCart();
  });
})();
