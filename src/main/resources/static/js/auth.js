// auth.js — login/cadastro via fetch + validação client-side
(function () {
  "use strict";

  var TOKEN_KEY = "locusverso:token";

  function getToken() {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  function saveToken(token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  function removeToken() {
    window.localStorage.removeItem(TOKEN_KEY);
  }

  // Expõe globalmente para outros scripts usarem
  window.LocusAuth = {
    getToken: getToken,
    saveToken: saveToken,
    removeToken: removeToken,
    getAuthHeaders: function () {
      var token = getToken();
      var headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = "Bearer " + token;
      }
      return headers;
    },
    isLoggedIn: function () {
      return !!getToken();
    },
    logout: function () {
      removeToken();
      window.location.href = "login.html";
    }
  };

  // --- Toggle de senha ---
  function initPasswordToggles() {
    var toggles = document.querySelectorAll("[data-password-toggle]");
    toggles.forEach(function (toggle) {
      var input = document.getElementById(toggle.getAttribute("data-password-toggle"));
      if (!input) return;
      toggle.addEventListener("click", function () {
        var isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        toggle.setAttribute("aria-pressed", String(isHidden));
        toggle.setAttribute("aria-label", isHidden ? "Ocultar senha" : "Mostrar senha");
      });
    });
  }

  // --- Validação client-side ---
  function showError(field, message) {
    var errorEl = document.getElementById(field.id + "-error");
    field.setAttribute("aria-invalid", "true");
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(field) {
    var errorEl = document.getElementById(field.id + "-error");
    field.removeAttribute("aria-invalid");
    if (errorEl) errorEl.textContent = "";
  }

  function validateField(field) {
    if (field.validity.valid) {
      clearError(field);
      return true;
    }
    var message = "Preencha este campo corretamente.";
    if (field.validity.valueMissing) {
      message = "Este campo é obrigatório.";
    } else if (field.validity.typeMismatch && field.type === "email") {
      message = "Digite um e-mail válido.";
    } else if (field.validity.tooShort) {
      message = "A senha deve ter no mínimo " + field.minLength + " caracteres.";
    }
    showError(field, message);
    return false;
  }

  // --- Login ---
  async function handleLogin(form) {
    var email = document.getElementById("login-email").value;
    var senha = document.getElementById("login-senha").value;

    var statusEl = form.querySelector("[data-form-status]");

    try {
      var response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, senha: senha })
      });

      if (!response.ok) {
        var errorMsg = response.status === 401 ? "Email ou senha inválidos." : "Erro ao fazer login.";
        showError(document.getElementById("login-email"), errorMsg);
        return;
      }

      var data = await response.json();
      saveToken(data.token);

      if (statusEl) statusEl.textContent = "Login realizado com sucesso!";
      window.location.href = "produtos.html";
    } catch (error) {
      showError(document.getElementById("login-email"), "Erro de conexão. Tente novamente.");
    }
  }

  // --- Cadastro ---
  async function handleCadastro(form) {
    var nome = document.getElementById("cadastro-nome").value;
    var email = document.getElementById("cadastro-email").value;
    var senha = document.getElementById("cadastro-senha").value;

    var statusEl = form.querySelector("[data-form-status]");

    try {
      var response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome, email: email, senha: senha })
      });

      if (!response.ok) {
        showError(document.getElementById("cadastro-email"), "Não foi possível concluir o cadastro. Verifique os dados.");
        return;
      }

      if (statusEl) statusEl.textContent = "Cadastro realizado com sucesso! Redirecionando...";
      setTimeout(function () {
        window.location.href = "login.html";
      }, 1000);
    } catch (error) {
      showError(document.getElementById("cadastro-email"), "Erro de conexão. Tente novamente.");
    }
  }

  // --- Init forms ---
  function initFormValidation() {
    var forms = document.querySelectorAll("[data-validate]");

    forms.forEach(function (form) {
      var fields = Array.prototype.slice.call(form.querySelectorAll("input[required]"));

      fields.forEach(function (field) {
        field.addEventListener("blur", function () {
          validateField(field);
        });
      });

      form.addEventListener("submit", async function (event) {
        event.preventDefault();
        var firstInvalid = null;

        fields.forEach(function (field) {
          var isValid = validateField(field);
          if (!isValid && !firstInvalid) {
            firstInvalid = field;
          }
        });

        if (firstInvalid) {
          firstInvalid.focus();
          return;
        }

        // Detecta se é form de login ou cadastro
        var isLogin = !!document.getElementById("login-email");
        var isCadastro = !!document.getElementById("cadastro-nome");

        if (isLogin) {
          await handleLogin(form);
        } else if (isCadastro) {
          await handleCadastro(form);
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPasswordToggles();
    initFormValidation();
  });
})();
