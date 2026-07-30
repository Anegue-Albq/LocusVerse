// ==========================================================================
// main.js — comportamento compartilhado entre todas as páginas
// (menu mobile, ano do rodapé)
// ==========================================================================
(function () {
  "use strict";

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
    initMobileNav();
    initFooterYear();
  });
})();
