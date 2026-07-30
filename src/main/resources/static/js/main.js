// ==========================================================================
// main.js — comportamento compartilhado entre todas as páginas
// (menu mobile, ano do rodapé)
// ==========================================================================
(function () {
  "use strict";

  var COLOR_MODE_KEY = "locusverso:color-mode";

  function setColorMode(enabled) {
    var root = document.documentElement;
    var toggle = document.querySelector("[data-color-mode-toggle]");

    if (enabled) {
      root.setAttribute("data-color-mode", "accessible");
      window.localStorage.setItem(COLOR_MODE_KEY, "accessible");
    } else {
      root.removeAttribute("data-color-mode");
      window.localStorage.removeItem(COLOR_MODE_KEY);
    }

    if (toggle) {
      toggle.setAttribute("aria-pressed", String(enabled));
      toggle.textContent = enabled ? "Paleta padrão" : "Paleta acessível";
    }
  }

  function initColorMode() {
    var toggle = document.querySelector("[data-color-mode-toggle]");
    var enabled = window.localStorage.getItem(COLOR_MODE_KEY) === "accessible";

    setColorMode(enabled);
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      setColorMode(document.documentElement.getAttribute("data-color-mode") !== "accessible");
    });
  }

  function initMobileNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.getElementById("main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "Fechar menu" : "Abrir menu";
    });

    // Fecha o menu ao pressionar Esc, devolvendo o foco ao botão
    nav.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Abrir menu";
        toggle.focus();
      }
    });
  }

  function initFooterYear() {
    var el = document.querySelector("[data-current-year]");
    if (el) {
      el.textContent = String(new Date().getFullYear());
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initColorMode();
    initMobileNav();
    initFooterYear();
  });
})();
