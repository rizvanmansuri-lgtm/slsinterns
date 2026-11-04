/* Accordion (program pages + home FAQ). Sliders live in js/sliders.js (Swiper). */
(function () {
  'use strict';

  // ---- Accordion (one open at a time) ----
  document.querySelectorAll('.acc__head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.parentElement;
      var open = item.classList.contains('is-open');
      document.querySelectorAll('.acc__item.is-open').forEach(function (i) {
        i.classList.remove('is-open');
        i.querySelector('.acc__head').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('is-open');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
