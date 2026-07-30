// auth.js — alternância de senha e validação client-side dos formulários
// de login e cadastro
(function () {
  "use strict";

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

  function showError(field, message) {
    var errorEl = document.getElementById(field.id + "-error");
    field.setAttribute("aria-invalid", "true");
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearError(field) {
    var errorEl = document.getElementById(field.id + "-error");
    field.removeAttribute("aria-invalid");
    if (errorEl) {
      errorEl.textContent = "";
    }
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

  function initFormValidation() {
    var forms = document.querySelectorAll("[data-validate]");

    forms.forEach(function (form) {
      var fields = Array.prototype.slice.call(form.querySelectorAll("input[required]"));

      fields.forEach(function (field) {
        field.addEventListener("blur", function () {
          validateField(field);
        });
      });

      form.addEventListener("submit", function (event) {
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

        var statusEl = form.querySelector("[data-form-status]");
        if (statusEl) {
          statusEl.textContent = "Formulário enviado com sucesso.";
        }
        form.reset();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPasswordToggles();
    initFormValidation();
  });
})();
