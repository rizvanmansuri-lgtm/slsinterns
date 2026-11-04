(function () {
  'use strict';
  document.querySelectorAll('[data-carousel]').forEach(init);

  function init(root) {
  var track = root.querySelector('.pcar__track');
  var cards = track.children;
  var dotsBox = root.querySelector('.pcar__dots');
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
    for (var i = 0; i < pages(); i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      (function (n) { b.addEventListener('click', function () { goTo(n); play(); }); })(i);
      dotsBox.appendChild(b);
    }
    mark();
  }
  function mark() {
    var cur = Math.min(index(), dotsBox.children.length - 1);
    Array.prototype.forEach.call(dotsBox.children, function (d, i) { d.classList.toggle('is-on', i === cur); });
  }
  /* Own smooth scroll: works even when the OS/browser has animations turned off,
     and temporarily disables scroll-snap so frames are not fought by the snapping. */
  var anim = null;
  function slideTo(left) {
    var max = track.scrollWidth - track.clientWidth;
    left = Math.max(0, Math.min(left, max));
    var from = track.scrollLeft, dist = left - from, dur = 550, t0 = null;
    if (anim) cancelAnimationFrame(anim);
    if (Math.abs(dist) < 2) return;
    track.style.scrollSnapType = 'none';
    track.style.scrollBehavior = 'auto';
    function frame(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      track.scrollLeft = from + dist * e;
      if (p < 1) anim = requestAnimationFrame(frame);
      else { anim = null; track.scrollLeft = left; track.style.scrollSnapType = ''; track.style.scrollBehavior = ''; }
    }
    anim = requestAnimationFrame(frame);
  }
  function goTo(n) { slideTo(n * step()); }
  function go(dir) {
    var max = track.scrollWidth - track.clientWidth - 2;
    if (dir > 0 && track.scrollLeft >= max) slideTo(0);
    else if (dir < 0 && track.scrollLeft <= 2) slideTo(max);
    else slideTo(track.scrollLeft + dir * step());
  }
  function play() { stop(); timer = setInterval(function () { go(1); }, 3800); }
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
