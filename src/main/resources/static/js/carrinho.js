// carrinho.js — stepper de quantidade e remoção de itens do carrinho
(function () {
  "use strict";

  var CART_KEY = "locusverso:cart-items";

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
  }

  function announce(message) {
    var region = document.querySelector("[data-live-region]");
    if (region) {
      region.textContent = message;
    }
  }

  function updateItemCount(items) {
    var countEl = document.querySelector("[data-cart-count]");
    var srEl = document.querySelector("[data-cart-count-sr]");
    var count = items.reduce(function (total, item) { return total + item.quantity; }, 0);

    if (countEl) countEl.textContent = String(count);
    if (srEl) srEl.textContent = count + (count === 1 ? " item no carrinho" : " itens no carrinho");
  }

  function renderCart() {
    var items = getCartItems();
    var list = document.querySelector(".cart-items");
    if (!list) return;

    list.innerHTML = "";

    var summary = document.querySelector(".cart-summary");
    if (!items.length) {
      list.innerHTML = '<li class="cart-empty">Seu carrinho está vazio.</li>';
      if (summary) summary.hidden = true;
      updateItemCount(items);
      return;
    }

    if (summary) summary.hidden = false;

    items.forEach(function (item, index) {
      var listItem = document.createElement("li");
      listItem.className = "cart-item";
      listItem.innerHTML =
        '<img class="cart-item__image" src="' + item.image + '" alt="Imagem do produto ' + item.name + '">' +
        '<p class="cart-item__name"></p>' +
        '<p class="cart-item__price">' + formatCurrency(item.price) + '</p>' +
        '<div class="cart-item__controls">' +
          '<div class="stepper">' +
            '<button type="button" data-step="-1" aria-label="Diminuir quantidade">−</button>' +
            '<label class="sr-only" for="qty-' + index + '">Quantidade</label>' +
            '<input type="number" id="qty-' + index + '" min="1" inputmode="numeric" readonly>' +
            '<button type="button" data-step="1" aria-label="Aumentar quantidade">+</button>' +
          '</div>' +
          '<button type="button" class="cart-item__remove" aria-label="Remover produto do carrinho">Remover</button>' +
        '</div>';

      listItem.querySelector(".cart-item__name").textContent = item.name;
      listItem.querySelector(".stepper input").value = item.quantity;
      listItem.querySelector("[data-step='-1']").setAttribute("aria-label", "Diminuir quantidade de " + item.name);
      listItem.querySelector("[data-step='1']").setAttribute("aria-label", "Aumentar quantidade de " + item.name);
      listItem.querySelector(".cart-item__remove").setAttribute("aria-label", "Remover " + item.name + " do carrinho");

      listItem.querySelector("[data-step='-1']").addEventListener("click", function () {
        items[index].quantity = Math.max(1, items[index].quantity - 1);
        setCartItems(items);
        renderCart();
        announce("Quantidade de " + item.name + " alterada para " + items[index].quantity + ".");
      });

      listItem.querySelector("[data-step='1']").addEventListener("click", function () {
        items[index].quantity += 1;
        setCartItems(items);
        renderCart();
        announce("Quantidade de " + item.name + " alterada para " + items[index].quantity + ".");
      });

      listItem.querySelector(".cart-item__remove").addEventListener("click", function () {
        items.splice(index, 1);
        setCartItems(items);
        renderCart();
        announce(item.name + " removido do carrinho.");
      });

      list.appendChild(listItem);
    });

    updateItemCount(items);
    var subtotal = items.reduce(function (total, item) { return total + item.price * item.quantity; }, 0);
    var shipping = subtotal >= 200 ? 0 : 19.9;
    document.querySelector("[data-cart-subtotal]").textContent = formatCurrency(subtotal);
    document.querySelector("[data-cart-shipping]").textContent = shipping === 0 ? "Grátis" : formatCurrency(shipping);
    document.querySelector("[data-cart-total]").textContent = formatCurrency(subtotal + shipping);
  }

  function initCheckout() {
    var form = document.querySelector(".payment-form");
    var status = document.querySelector("[data-checkout-status]");
    if (!form) return;
    form.addEventListener("checkout:complete", function () {
      window.localStorage.removeItem(CART_KEY);
      renderCart();
      status.textContent = "Pedido confirmado. Em breve você receberá os detalhes por e-mail.";
      status.focus();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderCart();
    initCheckout();
  });
})();
