// ==========================================================================
// main.js — comportamento compartilhado entre todas as páginas
// (menu mobile, ano do rodapé, tema claro/escuro)
// ==========================================================================
(function () {
  "use strict";

  var THEME_KEY = "locusverso:theme";

  var MOON_SVG =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">' +
    '<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  var SUN_SVG =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.8"/>' +
    '<path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
    "</svg>";

  function applyTheme(dark, animate) {
    var html = document.documentElement;

    if (animate) {
      html.classList.add("theme-transition");
      window.setTimeout(function () {
        html.classList.remove("theme-transition");
      }, 420);
    }

    // Apenas alterna html.theme-dark — as classes do body (theme-light / theme-dark)
    // permanecem como definidas no HTML da página. Isso preserva os seletores CSS
    // que dependem de "html.theme-dark body.theme-light" para o fundo navy em dark mode.
    if (dark) {
      html.classList.add("theme-dark");
      // Remove .site-header--light para não conflitar com o override de dark mode.
      document.querySelectorAll(".site-header--light").forEach(function (el) {
        el.setAttribute("data-light-header", "true");
        el.classList.remove("site-header--light");
      });
    } else {
      html.classList.remove("theme-dark");
      // Restaura .site-header--light nos headers que o tinham originalmente.
      document.querySelectorAll("[data-light-header]").forEach(function (el) {
        el.classList.add("site-header--light");
      });
    }
  }

  function updateToggleSwitch(wrapper, dark) {
    var input = wrapper.querySelector("input");
    var label = wrapper.querySelector(".theme-switch__label");
    if (input) input.checked = dark;
    if (label) label.setAttribute("aria-label", dark ? "Ativar modo claro" : "Ativar modo escuro");
  }

  function initThemeToggle() {
    var saved = window.localStorage.getItem(THEME_KEY);
    var isDark = saved === "dark";
    applyTheme(isDark);

    // Estrutura: <li><label class="theme-switch"><input type="checkbox"><span track><span thumb></label></li>
    var switchId = "theme-switch-cb";
    var wrapper = document.createElement("li");
    wrapper.className = "theme-switch-wrap";
    wrapper.innerHTML =
      "<label class=\"theme-switch\" for=\"" + switchId + "\" aria-label=\"" + (isDark ? "Ativar modo claro" : "Ativar modo escuro") + "\">" +
        "<span class=\"theme-switch__icon\">" + SUN_SVG + "</span>" +
        "<input id=\"" + switchId + "\" type=\"checkbox\" role=\"switch\" class=\"sr-only\"" + (isDark ? " checked" : "") + " />" +
        "<span class=\"theme-switch__track\" aria-hidden=\"true\">" +
          "<span class=\"theme-switch__thumb\"></span>" +
        "</span>" +
        "<span class=\"theme-switch__icon\">" + MOON_SVG + "</span>" +
      "</label>";

    var input = wrapper.querySelector("input");

    input.addEventListener("change", function () {
      isDark = input.checked;
      applyTheme(isDark, true);
      window.localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
      var lbl = wrapper.querySelector(".theme-switch");
      if (lbl) lbl.setAttribute("aria-label", isDark ? "Ativar modo claro" : "Ativar modo escuro");
    });

    var iconLinks = document.querySelector(".icon-links");
    if (iconLinks) {
      iconLinks.appendChild(wrapper);
    }
  }

  function initHeaderButtons() {
    // Minha Conta agora possui uma tela própria.
    // O link permanece navegável para minha-conta.html.
    document.querySelectorAll("[data-account-link]").forEach(function (el) {
      el.removeAttribute("data-account-link");
    });

    // Favoritos no header é um link para favoritos.html; os botões dos cards
    // continuam sendo tratados por produtos.js.
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

    nav.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Abrir menu";
        toggle.focus();
      }
    });
  }

  function initSteppers() {
    document.querySelectorAll(".stepper").forEach(function (stepper) {
      var input = stepper.querySelector("input[type='number']");
      if (!input) return;

      stepper.querySelectorAll("button[data-step]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var step = parseInt(btn.getAttribute("data-step"), 10);
          var current = parseInt(input.value, 10) || 1;
          var min = parseInt(input.min, 10) || 1;
          var next = Math.max(min, current + step);
          input.value = next;
        });
      });
    });
  }

  function initFooterYear() {
    var el = document.querySelector("[data-current-year]");
    if (el) {
      el.textContent = String(new Date().getFullYear());
    }
  }

  // Aplica o tema antes do DOMContentLoaded para evitar flash
  (function () {
    var saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "dark") {
      document.documentElement.classList.add("theme-dark");
    }
  })();

  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();
    initHeaderButtons();
    initMobileNav();
    initFooterYear();
  });
})();
