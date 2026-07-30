// ==========================================================================
// carrinho.js — stepper de quantidade e remoção de itens do carrinho
// ==========================================================================
(function () {
  "use strict";

  function announce(message) {
    var region = document.querySelector("[data-live-region]");
    if (region) {
      region.textContent = message;
    }
  }

  function updateItemCount() {
    var items = document.querySelectorAll(".cart-item");
    var countEl = document.querySelector("[data-cart-count]");
    var srEl = document.querySelector("[data-cart-count-sr]");
    var count = items.length;

    if (countEl) countEl.textContent = String(count);
    if (srEl) srEl.textContent = count + (count === 1 ? " item no carrinho" : " itens no carrinho");
  }

  function initSteppers() {
    document.querySelectorAll(".cart-item").forEach(function (item) {
      var input = item.querySelector(".stepper input");
      var decrement = item.querySelector("[data-step='-1']");
      var increment = item.querySelector("[data-step='1']");
      var removeBtn = item.querySelector(".cart-item__remove");
      var name = item.querySelector(".cart-item__name").textContent.trim();

      if (decrement) {
        decrement.addEventListener("click", function () {
          var value = Math.max(1, parseInt(input.value, 10) - 1);
          input.value = value;
        });
      }

      if (increment) {
        increment.addEventListener("click", function () {
          var value = parseInt(input.value, 10) + 1;
          input.value = value;
        });
      }

      if (removeBtn) {
        removeBtn.addEventListener("click", function () {
          item.remove();
          announce(name + " removido do carrinho.");
          updateItemCount();
        });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSteppers();
    updateItemCount();
  });
})();
