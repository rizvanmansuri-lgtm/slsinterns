/* Home hero slider: crossfades text + image, auto-plays, dots to jump */
(function () {
  'use strict';
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var slides = hero.querySelectorAll('.hero__slide');
  var imgs = hero.querySelectorAll('.hero__image img');
  var dots = hero.querySelectorAll('.hero__dots button');
  if (slides.length < 2) return;
  var i = 0, timer = null;

  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
    imgs.forEach(function (m, k) { m.classList.toggle('is-active', k === i); });
    dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
  }
  function play() { stop(); timer = setInterval(function () { show(i + 1); }, 6500); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); play(); }); });
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', play);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });
  play();
})();
