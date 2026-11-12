/* =====================================================================
   OFFER-STACK  –  script for the stacked "What We Offer" section (.otest)
   Used by: indextest.html and index-new.html. Delete together with css/offer-stack.css
   if the section is removed.
   The pinned/overlapping cards are pure CSS (position: sticky).
   This file only adds the depth effect: a card that is being covered
   by the next one shrinks and darkens slightly.
   ===================================================================== */
(function () {
  'use strict';
  var cards = Array.prototype.slice.call(document.querySelectorAll('.otest__card'));
  if (!cards.length) return;
  cards.forEach(function (c, i) { c.style.setProperty('--i', i); });

  var ticking = false;
  function update() {
    ticking = false;
    for (var i = 0; i < cards.length - 1; i++) {
      var cur = cards[i], next = cards[i + 1];
      var stickyTop = parseFloat(getComputedStyle(cur).top) || 0;
      var h = cur.offsetHeight || 1;
      var dist = next.getBoundingClientRect().top - (stickyTop + 14);   // 14px = the stagger of the next card
      var p = 1 - Math.max(0, Math.min(1, dist / h));
      cur.style.setProperty('--p', p.toFixed(3));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
