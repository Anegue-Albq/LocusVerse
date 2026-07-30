// suporte.js — accordion acessível (aria-expanded / aria-controls / hidden)
// Apenas um painel fica aberto por vez, seguindo o layout do Figma.
(function () {
  "use strict";

  function initAccordion() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll(".accordion-trigger"));

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var panel = document.getElementById(trigger.getAttribute("aria-controls"));
        var isExpanded = trigger.getAttribute("aria-expanded") === "true";

        triggers.forEach(function (otherTrigger) {
          var otherPanel = document.getElementById(otherTrigger.getAttribute("aria-controls"));
          otherTrigger.setAttribute("aria-expanded", "false");
          if (otherPanel) otherPanel.hidden = true;
        });

        if (!isExpanded) {
          trigger.setAttribute("aria-expanded", "true");
          if (panel) panel.hidden = false;
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initAccordion);
})();
