/* indexnew1.html only: scroll-driven "What We Offer" (sticky stage, one domain per scroll step; chips jump). */
(function () {
  'use strict';
  var sec = document.querySelector('.o1');
  if (!sec) return;
  var track = sec.querySelector('.o1__track'), stage = sec.querySelector('.o1__stage');
  var chips = [].slice.call(sec.querySelectorAll('.o1__chip'));
  var panels = [].slice.call(sec.querySelectorAll('.o1__panel'));
  var bar = sec.querySelector('.o1__bar i'), hint = sec.querySelector('.o1__hinttext');
  var n = panels.length, cur = -1, ticking = false;

  function setActive(i) {
    if (i === cur) return;
    cur = i;
    panels.forEach(function (p, k) {
      var on = k === i;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
      var a = p.querySelector('a'); if (a) a.tabIndex = on ? 0 : -1;
    });
    chips.forEach(function (c, k) {
      c.classList.toggle('is-active', k === i);
      c.setAttribute('aria-selected', k === i ? 'true' : 'false');
    });
    var c = chips[i];
    if (c && c.parentNode.scrollWidth > c.parentNode.clientWidth) {
      var box = c.parentNode;
      box.scrollTo({ left: c.offsetLeft - (box.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
    }
    if (hint) hint.textContent = i === n - 1 ? 'You made it! 🎉' : 'Keep scrolling ↓';
  }

  function range() { return Math.max(1, track.offsetHeight - stage.offsetHeight); }
  function update() {
    ticking = false;
    var r = track.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, -(r.top - stage.offsetTop + 0) / range()));
    p = Math.min(1, Math.max(0, (-r.top) / range()));
    setActive(Math.min(n - 1, Math.floor(p * n)));
    if (bar) bar.style.width = (p * 100) + '%';
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  chips.forEach(function (c, i) {
    c.setAttribute('role', 'tab');
    c.addEventListener('click', function () {
      var top = track.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: top + (i + 0.5) / n * range(), behavior: 'smooth' });
    });
  });
  update();
})();
