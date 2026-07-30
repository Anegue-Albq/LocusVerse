// carousel.js — carrossel de personagens da Home
// Segue o padrão de carrossel acessível: grupo de slides + tablist de seleção
(function () {
  "use strict";

  function initCarousel() {
    var root = document.querySelector("[data-carousel]");
    if (!root) return;

    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-slide]"));
    var nextBtn = root.querySelector("[data-carousel-next]");
    var status = root.querySelector("[data-carousel-status]");
    var dotsWrapper = document.querySelector("[data-carousel-dots]");
    var dots = dotsWrapper ? Array.prototype.slice.call(dotsWrapper.querySelectorAll("[role='tab']")) : [];
    var current = 0;

    function getTitle(slide) {
      var title = slide.querySelector(".hero__title");
      return title ? title.textContent.trim() : "";
    }

    function goTo(index) {
      var total = slides.length;
      var nextIndex = (index + total) % total;

      slides[current].hidden = true;
      slides[current].classList.remove("is-active");
      dots[current] && dots[current].setAttribute("aria-selected", "false");
      dots[current] && dots[current].setAttribute("tabindex", "-1");

      current = nextIndex;

      slides[current].hidden = false;
      slides[current].classList.add("is-active");
      dots[current] && dots[current].setAttribute("aria-selected", "true");
      dots[current] && dots[current].setAttribute("tabindex", "0");

      if (status) {
        status.textContent = "Mostrando personagem " + (current + 1) + " de " + total + ": " + getTitle(slides[current]);
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(current + 1);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        goTo(index);
        dot.focus();
      });

      dot.addEventListener("keydown", function (event) {
        var lastIndex = dots.length - 1;
        var targetIndex = null;

        if (event.key === "ArrowRight") {
          targetIndex = index === lastIndex ? 0 : index + 1;
        } else if (event.key === "ArrowLeft") {
          targetIndex = index === 0 ? lastIndex : index - 1;
        } else if (event.key === "Home") {
          targetIndex = 0;
        } else if (event.key === "End") {
          targetIndex = lastIndex;
        }

        if (targetIndex !== null) {
          event.preventDefault();
          goTo(targetIndex);
          dots[targetIndex].focus();
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initCarousel);
})();
