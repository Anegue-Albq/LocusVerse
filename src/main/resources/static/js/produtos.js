// produtos.js — favoritar, carrinho e carrossel do catálogo
// ===========================================================================
(function () {
  "use strict";

  var CART_KEY = "locusverso:cart-count";
  var FAVORITES_KEY = "locusverso:favorites";  var FAVORITES_KEY = "locusverso:favorites";

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
    if (region) region.textContent = message;
  }

  function getFavorites() {
    try {
      return JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function setFavorites(favorites) {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  function initFavorites() {
    var favorites = getFavorites();
    document.querySelectorAll("[data-favorite]").forEach(function (button) {
      var productCard = button.closest(".product-card");
      var productName = button.dataset.productName || (productCard ? productCard.querySelector(".product-card__name").textContent.trim() : "Produto");
      var isSaved = favorites.indexOf(productName) !== -1;
      button.setAttribute("aria-pressed", String(isSaved));
      button.setAttribute("aria-label", (isSaved ? "Remover " : "Adicionar ") + productName + (isSaved ? " dos favoritos" : " aos favoritos"));

      button.addEventListener("click", function () {
        var current = getFavorites();
        var index = current.indexOf(productName);
        if (index === -1) {
          current.push(productName);
        } else {
          current.splice(index, 1);
        }
        setFavorites(current);
        var active = index === -1;
        button.setAttribute("aria-pressed", String(active));
        button.setAttribute("aria-label", (active ? "Remover " : "Adicionar ") + productName + (active ? " dos favoritos" : " aos favoritos"));
        announce(productName + (active ? " adicionado aos favoritos." : " removido dos favoritos."));
      });
    });
  }

  function initAddToCart() {
    document.querySelectorAll("[data-add-to-cart]").forEach(function (button) {
      button.addEventListener("click", function () {
        var productCard = button.closest(".product-card");
        var productName = button.dataset.productName || (productCard ? productCard.querySelector(".product-card__name").textContent.trim() : "Produto");
        setCartCount(getCartCount() + 1);
        announce(productName + " adicionado ao carrinho.");
      });
    });
  }

  function initCarousel() {
    document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
      var track = carousel.querySelector("[data-carousel-track]");
      var previous = carousel.querySelector("[data-carousel-prev]");
      var next = carousel.querySelector("[data-carousel-next]");
      if (!track || !previous || !next) return;

      function scrollByCard(direction) {
        var card = track.querySelector(".product-card");
        if (!card) return;
        track.scrollBy({ left: direction * (card.getBoundingClientRect().width + 20), behavior: "smooth" });
      }

      previous.addEventListener("click", function () { scrollByCard(-1); });
      next.addEventListener("click", function () { scrollByCard(1); });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setCartCount(getCartCount());
    initFavorites();
    initAddToCart();
    initCarousel();
  });
})();
