/* =====================================================================
   INDEX-NEW  –  scripts used ONLY by index-new.html
   Safe to delete together with: index-new.html, css/index-new.css
   (needs Swiper: js/vendor/swiper-bundle.min.js, loaded before this file;
    header / reveal effects come from js/main.js as on every page)
   ===================================================================== */
(function () {
  'use strict';

  // ---- FAQ accordion ----
  document.querySelectorAll('.acc__head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.parentElement;
      var open = item.classList.contains('is-open');
      document.querySelectorAll('.acc__item.is-open').forEach(function (i) {
        i.classList.remove('is-open');
        i.querySelector('.acc__head').setAttribute('aria-expanded', 'false');
      });
      if (!open) { item.classList.add('is-open'); head.setAttribute('aria-expanded', 'true'); }
    });
  });

  if (typeof Swiper === 'undefined') return;
  var CFG = window.SITE_CONFIG || {};

  // ---- Full-width hero ----
  var hero = document.querySelector('.nhero');
  if (hero) {
    new Swiper(hero, {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      rewind: true,
      speed: CFG.heroSpeed || 700,
      autoplay: { delay: CFG.heroDelay || 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: hero.querySelector('.swiper-pagination'), clickable: true },
      navigation: { prevEl: hero.querySelector('.nhero__arrow--prev'), nextEl: hero.querySelector('.nhero__arrow--next') }
    });
  }

  // ---- Card carousels (programs, testimonials) ----
  document.querySelectorAll('[data-nw="cards"]').forEach(function (root) {
    var el = root.querySelector('.swiper');
    if (!el) return;
    new Swiper(el, {
      slidesPerView: 1.15,
      spaceBetween: 24,
      rewind: true,
      speed: CFG.cardsSpeed || 500,
      autoplay: { delay: CFG.cardsDelay || 3000, disableOnInteraction: false, pauseOnMouseEnter: true },
      navigation: { prevEl: root.querySelector('[data-dir="-1"]'), nextEl: root.querySelector('[data-dir="1"]') },
      pagination: { el: root.querySelector('.swiper-pagination'), clickable: true },
      breakpoints: {
        561:  { slidesPerView: 2 },
        1101: { slidesPerView: parseInt(root.getAttribute('data-per-view'), 10) || 4 }
      }
    });
  });
})();
