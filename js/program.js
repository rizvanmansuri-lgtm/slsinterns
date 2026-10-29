/* Program pages: accordion, mentor slider, partner slider */
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

  // ---- Simple slider (slides = .slide, buttons = [data-dir]) ----
  document.querySelectorAll('[data-slider]').forEach(function (box) {
    var slides = box.querySelectorAll('.slide');
    var i = 0;
    function go(n) {
      if (!slides.length) return;
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
    }
    box.querySelectorAll('[data-dir]').forEach(function (b) {
      b.addEventListener('click', function () { go(i + parseInt(b.getAttribute('data-dir'), 10)); });
    });
    go(0);
  });
})();
