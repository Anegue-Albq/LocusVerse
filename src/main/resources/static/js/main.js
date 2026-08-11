// main.js — comportamento compartilhado entre todas as páginas
// (menu mobile, ano do rodapé)
(function () {
  "use strict";

  var CUSTOM_COLOR_KEY = "locusverso:custom-colors";
  var DEFAULT_PRIMARY = "#ffc900";
  var DEFAULT_SECONDARY = "#3b46c9";

  function clampChannel(value) {
    return Math.max(0, Math.min(255, value));
  }

  // Clareia (percent > 0) ou escurece (percent < 0) uma cor hexadecimal
  function shadeColor(hex, percent) {
    var num = parseInt(hex.replace("#", ""), 16);
    var amt = Math.round(2.55 * percent);
    var r = clampChannel((num >> 16) + amt);
    var g = clampChannel(((num >> 8) & 0x00ff) + amt);
    var b = clampChannel((num & 0x0000ff) + amt);
    return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  }

  function applyCustomColors(colors) {
    var root = document.documentElement;
    root.style.setProperty("--color-yellow-500", colors.primary);
    root.style.setProperty("--color-yellow-600", shadeColor(colors.primary, -15));
    root.style.setProperty("--color-yellow-100", shadeColor(colors.primary, 75));
    root.style.setProperty("--color-blue-accent", colors.secondary);
    root.style.setProperty("--color-blue-accent-dark", shadeColor(colors.secondary, -20));
    root.style.setProperty("--color-star", colors.secondary);
    root.style.setProperty("--color-navy-900", colors.secondary);
  }

  function clearCustomColors() {
    var root = document.documentElement;
    ["--color-yellow-500", "--color-yellow-600", "--color-yellow-100", "--color-blue-accent", "--color-blue-accent-dark", "--color-star", "--color-navy-900"].forEach(function (prop) {
      root.style.removeProperty(prop);
    });
  }

  function getSavedColors() {
    try {
      return JSON.parse(window.localStorage.getItem(CUSTOM_COLOR_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function setToggleState(toggle, active) {
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", String(active));
    toggle.textContent = active ? "Paleta personalizada" : "Personalizar paleta";
  }

  function buildColorPickerPanel(toggle, colors) {
    var wrapper = document.createElement("span");
    wrapper.className = "color-mode-picker";
    toggle.parentNode.insertBefore(wrapper, toggle);
    wrapper.appendChild(toggle);

    var panel = document.createElement("div");
    panel.className = "color-mode-picker__panel";
    panel.id = "color-mode-picker-panel";
    panel.setAttribute("data-color-mode-panel", "");
    panel.hidden = true;
    panel.innerHTML =
      '<p class="color-mode-picker__title">Personalize as cores do site</p>' +
      '<label class="color-mode-picker__field">Cor primária' +
        '<input type="color" data-color-primary value="' + colors.primary + '" />' +
      "</label>" +
      '<label class="color-mode-picker__field">Cor secundária' +
        '<input type="color" data-color-secondary value="' + colors.secondary + '" />' +
      "</label>" +
      '<button type="button" class="btn btn-outline btn-sm" data-color-reset>Restaurar padrão</button>';

    wrapper.appendChild(panel);

    toggle.setAttribute("aria-haspopup", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", panel.id);

    return panel;
  }

  function initColorMode() {
    var saved = getSavedColors();
    // Aplica a paleta salva em toda página, mesmo nas que não têm o seletor de cores
    if (saved) applyCustomColors(saved);

    var toggle = document.querySelector("[data-color-mode-toggle]");
    if (!toggle) return;

    var colors = saved || { primary: DEFAULT_PRIMARY, secondary: DEFAULT_SECONDARY };
    setToggleState(toggle, !!saved);

    var panel = buildColorPickerPanel(toggle, colors);
    var primaryInput = panel.querySelector("[data-color-primary]");
    var secondaryInput = panel.querySelector("[data-color-secondary]");
    var resetButton = panel.querySelector("[data-color-reset]");

    function persistAndApply() {
      var novasCores = { primary: primaryInput.value, secondary: secondaryInput.value };
      applyCustomColors(novasCores);
      window.localStorage.setItem(CUSTOM_COLOR_KEY, JSON.stringify(novasCores));
      setToggleState(toggle, true);
    }

    primaryInput.addEventListener("input", persistAndApply);
    secondaryInput.addEventListener("input", persistAndApply);

    resetButton.addEventListener("click", function () {
      clearCustomColors();
      window.localStorage.removeItem(CUSTOM_COLOR_KEY);
      primaryInput.value = DEFAULT_PRIMARY;
      secondaryInput.value = DEFAULT_SECONDARY;
      setToggleState(toggle, false);
    });

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      panel.hidden = !panel.hidden;
      toggle.setAttribute("aria-expanded", String(!panel.hidden));
    });

    document.addEventListener("click", function (event) {
      if (!panel.hidden && !panel.contains(event.target) && event.target !== toggle) {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }
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

  function showToast(message, options) {
    options = options || {};
    var container = document.querySelector("[data-toast-container]");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      container.setAttribute("data-toast-container", "");
      container.setAttribute("role", "status");
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }

    var toast = document.createElement("div");
    toast.className = "toast" + (options.variant ? " toast--" + options.variant : "");
    toast.textContent = message;
    container.appendChild(toast);

    window.requestAnimationFrame(function () {
      toast.classList.add("toast--visible");
    });

    var duration = options.duration || 3500;
    window.setTimeout(function () {
      toast.classList.remove("toast--visible");
      toast.addEventListener("transitionend", function () {
        toast.remove();
      }, { once: true });
    }, duration);
  }

  window.LocusToast = { show: showToast };

  document.addEventListener("DOMContentLoaded", function () {
    initColorMode();
    initMobileNav();
    initFooterYear();
  });
})();
