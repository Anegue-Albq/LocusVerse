(function () {
  "use strict";

  var FAVORITES_KEY = "locusverso:favorites";

  function getFavorites() {
    try {
      return JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function renderFavorites() {
    var list = document.querySelector("[data-favorites-list]");
    var empty = document.querySelector("[data-favorites-empty]");
    if (!list || !empty) return;

    var favorites = getFavorites();
    empty.hidden = favorites.length > 0;
    list.innerHTML = "";

    favorites.forEach(function (name) {
      var item = document.createElement("li");
      item.className = "product-card";
      item.innerHTML =
        '<article>' +
          '<a class="product-card__link" href="produto-detalhe.html">' +
            '<img class="product-card__image" src="../static/assets/product-placeholder.svg" alt="" />' +
            '<h3 class="product-card__name"></h3>' +
          '</a>' +
          '<p class="product-card__rating" aria-label="Avaliação: 5 de 5 estrelas">★★★★★</p>' +
          '<p class="product-card__price"><span class="product-card__price-label">A partir de:</span>R$00,00</p>' +
          '<div class="product-card__actions"><a class="btn btn-primary btn-sm product-card__add" href="produto-detalhe.html">Comprar</a><button type="button" class="product-card__favorite" data-remove-favorite aria-label="Remover produto dos favoritos">♥</button></div>' +
        '</article>';
      item.querySelector(".product-card__name").textContent = name;
      item.querySelector("[data-remove-favorite]").addEventListener("click", function () {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(getFavorites().filter(function (favorite) { return favorite !== name; })));
        renderFavorites();
      });
      list.appendChild(item);
    });
  }

  document.addEventListener("DOMContentLoaded", renderFavorites);
})();
