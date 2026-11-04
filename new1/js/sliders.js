/* =====================================================================
   SLIDERS  –  every slider on the site runs on Swiper (js/vendor/swiper-bundle.min.js)
   Docs: https://swiperjs.com/swiper-api
     [hero]              home hero (fade)             .hero.swiper
     [data-swiper=cards] programs + testimonials      autoplay, arrows, clickable dots
     [data-swiper=single] mentors + partner slider    one slide at a time, arrows
   ===================================================================== */
(function () {
  'use strict';
  if (typeof Swiper === 'undefined') return;
  var CFG = window.SITE_CONFIG || {};

  // ---- Home hero ----
  var hero = document.querySelector('.hero.swiper');
  if (hero) {
    new Swiper(hero, {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      rewind: true,
      speed: CFG.heroSpeed || 700,
      autoplay: { delay: CFG.heroDelay || 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: hero.querySelector('.swiper-pagination'), clickable: true }
    });
  }

  // ---- Card carousels (programs, testimonials) ----
  document.querySelectorAll('[data-swiper="cards"]').forEach(function (root) {
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

  // ---- Single-slide sliders (mentors, partner profile) ----
  document.querySelectorAll('[data-swiper="single"]').forEach(function (root) {
    var el = root.querySelector('.swiper');
    if (!el) return;
    var count = el.querySelectorAll('.swiper-slide').length;
    if (count < 2) root.classList.add('is-single');
    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: root.classList.contains('pmentors') ? 90 : 24,  /* bigger gap so the next mentor never peeks into the shadow area */
      rewind: true,
      speed: 500,
      autoHeight: true,
      allowTouchMove: count > 1,
      navigation: { prevEl: root.querySelector('[data-dir="-1"]'), nextEl: root.querySelector('[data-dir="1"]') }
    });
  });
})();
