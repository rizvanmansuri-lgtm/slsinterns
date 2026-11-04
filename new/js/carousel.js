(function () {
  'use strict';
  document.querySelectorAll('[data-carousel]').forEach(init);

  function init(root) {
  var track = root.querySelector('.pcar__track');
  var cards = track.children;
  var dotsBox = root.querySelector('.pcar__dots');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = null;

  function step() {
    var c = cards[0];
    return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 24) : 300;
  }
  function perView() { return Math.max(1, Math.round(track.clientWidth / step())); }
  function pages() { return Math.max(1, cards.length - perView() + 1); }
  function index() { return Math.round(track.scrollLeft / step()); }

  function buildDots() {
    dotsBox.innerHTML = '';
    for (var i = 0; i < pages(); i++) dotsBox.appendChild(document.createElement('i'));
    mark();
  }
  function mark() {
    var cur = Math.min(index(), dotsBox.children.length - 1);
    Array.prototype.forEach.call(dotsBox.children, function (d, i) { d.classList.toggle('is-on', i === cur); });
  }
  function go(dir) {
    var max = track.scrollWidth - track.clientWidth - 2;
    if (dir > 0 && track.scrollLeft >= max) track.scrollTo({ left: 0 });
    else if (dir < 0 && track.scrollLeft <= 2) track.scrollTo({ left: max });
    else track.scrollBy({ left: dir * step() });
  }
  function play() { if (reduce) return; stop(); timer = setInterval(function () { go(1); }, 3800); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  root.querySelectorAll('[data-dir]').forEach(function (b) {
    b.addEventListener('click', function () { go(parseInt(b.getAttribute('data-dir'), 10)); play(); });
  });
  track.addEventListener('scroll', function () { window.requestAnimationFrame(mark); }, { passive: true });
  ['mouseenter', 'focusin', 'touchstart'].forEach(function (e) { root.addEventListener(e, stop, { passive: true }); });
  ['mouseleave', 'focusout', 'touchend'].forEach(function (e) { root.addEventListener(e, play, { passive: true }); });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });
  window.addEventListener('resize', buildDots);
  buildDots();
  play();
  }
})();
