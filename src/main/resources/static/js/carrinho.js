// carrinho.js — carrinho integrado com API backend via fetch
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

  function formatPrice(value) {
    return "R$" + Number(value).toFixed(2).replace(".", ",");
  }

  function updateCartBadge(count) {
    var badge = document.querySelector("[data-cart-count]");
    var srEl = document.querySelector("[data-cart-count-sr]");
    if (badge) badge.textContent = String(count);
    if (srEl) srEl.textContent = count + (count === 1 ? " item no carrinho" : " itens no carrinho");
  }

  function updateSummary(carrinho) {
    var summaryEl = document.querySelector(".cart-summary");
    if (!summaryEl) return;

    var total = carrinho.total || 0;
    summaryEl.innerHTML =
      '<dl>' +
        '<dt>Subtotal:</dt><dd>' + formatPrice(total) + '</dd>' +
        '<dt>Taxas:</dt><dd>R$0,00</dd>' +
        '<dt class="total-row">Total:</dt><dd class="total-row">' + formatPrice(total) + '</dd>' +
      '</dl>';
  }

  function renderCart(carrinho) {
    var list = document.querySelector(".cart-items");
    if (!list) return;

    var itens = carrinho.itens || [];
    list.innerHTML = "";

    if (!itens.length) {
      list.innerHTML = '<li class="cart-empty">Seu carrinho está vazio.</li>';
      updateCartBadge(0);
      updateSummary({ total: 0 });
      return;
    }

    itens.forEach(function (item, index) {
      var produto = item.produto;
      var li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML =
        '<img class="cart-item__image" src="' + (produto.imagemUrl || '../static/assets/product-placeholder.svg') + '" alt="Imagem do produto ' + produto.nome + '">' +
        '<p class="cart-item__name">' + produto.nome + '</p>' +
        '<p class="cart-item__price">' + formatPrice(item.precoUnitario) + '</p>' +
        '<div class="cart-item__controls">' +
          '<div class="stepper">' +
            '<button type="button" data-step="-1" data-item-id="' + item.id + '" aria-label="Diminuir quantidade de ' + produto.nome + '">−</button>' +
            '<label class="sr-only" for="qty-' + index + '">Quantidade de ' + produto.nome + '</label>' +
            '<input type="number" id="qty-' + index + '" value="' + item.quantidade + '" min="1" inputmode="numeric" readonly />' +
            '<button type="button" data-step="1" data-item-id="' + item.id + '" aria-label="Aumentar quantidade de ' + produto.nome + '">+</button>' +
          '</div>' +
          '<button type="button" class="cart-item__remove" data-remove-id="' + item.id + '" aria-label="Remover ' + produto.nome + ' do carrinho">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">' +
              '<path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 12a2 2 0 002 2h4a2 2 0 002-2l1-12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />' +
            '</svg>' +
          '</button>' +
        '</div>';

      list.appendChild(li);
    });

    updateCartBadge(itens.length);
    updateSummary(carrinho);
  }

  async function fetchCarrinho() {
    if (!isLoggedIn()) {
      renderCart({ itens: [], total: 0 });
      return;
    }
    try {
      var response = await fetch(API_BASE + "/v1/carrinho", { headers: getAuthHeaders() });
      if (!response.ok) {
        renderCart({ itens: [], total: 0 });
        return;
      }
      var carrinho = await response.json();
      renderCart(carrinho);
    } catch (e) {
      console.error(e);
      renderCart({ itens: [], total: 0 });
    }
  }

  async function updateQuantidade(itemId, novaQtd) {
    try {
      var response = await fetch(API_BASE + "/v1/carrinho/item/" + itemId, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantidade: novaQtd })
      });
      if (!response.ok) throw new Error("Erro ao atualizar");
      var carrinho = await response.json();
      renderCart(carrinho);
      announce("Quantidade atualizada.");
    } catch (e) {
      announce("Erro ao atualizar quantidade.");
    }
  }

  async function removerItem(itemId) {
    try {
      await fetch(API_BASE + "/v1/carrinho/item/" + itemId, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      await fetchCarrinho();
      announce("Produto removido do carrinho.");
    } catch (e) {
      announce("Erro ao remover produto.");
    }
  }

  async function checkout(form) {
    var endereco = document.getElementById("checkout-address")
      ? document.getElementById("checkout-address").value || "Endereço não informado"
      : "Endereço não informado";

    try {
      var response = await fetch(API_BASE + "/v1/pedido/checkout", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ enderecoEntrega: endereco })
      });

      if (!response.ok) {
        announce("Erro ao finalizar pedido.");
        return;
      }

      announce("Pedido realizado com sucesso!");
      renderCart({ itens: [], total: 0 });

      var statusEl = form.querySelector("[data-form-status]") || form.closest("main").querySelector("[data-live-region]");
      if (statusEl) statusEl.textContent = "Pedido finalizado com sucesso!";

      alert("Pedido realizado com sucesso!");
    } catch (e) {
      announce("Erro de conexão ao finalizar pedido.");
    }
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

  function initEvents() {
    document.addEventListener("click", function (e) {
      // Stepper buttons
      var stepBtn = e.target.closest("[data-step]");
      if (stepBtn) {
        var itemId = stepBtn.getAttribute("data-item-id");
        var input = stepBtn.closest(".stepper").querySelector("input");
        var currentQty = parseInt(input.value) || 1;
        var delta = parseInt(stepBtn.getAttribute("data-step"));
        var newQty = Math.max(1, currentQty + delta);
        if (newQty !== currentQty) {
          updateQuantidade(itemId, newQty);
        }
        return;
      }

      // Remove button
      var removeBtn = e.target.closest("[data-remove-id]");
      if (removeBtn) {
        removerItem(removeBtn.getAttribute("data-remove-id"));
        return;
      }
    });

    // Checkout form
    var paymentForm = document.querySelector(".payment-form");
    if (paymentForm) {
      paymentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!isLoggedIn()) {
          announce("Faça login para finalizar a compra.");
          window.location.href = "login.html";
          return;
        }
        checkout(paymentForm);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetchCarrinho();
    initEvents();
    initFavoritesSidebar();
  });
})();
