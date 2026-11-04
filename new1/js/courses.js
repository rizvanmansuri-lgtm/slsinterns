(function () {
  'use strict';
  var btns = document.querySelectorAll('.cfilter button');
  var cards = document.querySelectorAll('.ccard');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      btns.forEach(function (x) { x.classList.toggle('is-active', x === b); });
      cards.forEach(function (c) { c.hidden = !(f === 'all' || c.getAttribute('data-cat') === f); });
    });
  });
})();
