/* Courses page: category filter + pagination.
   Cards are <article class="ccard" data-cat="slug"> inside #courseList.
   Filter buttons carry data-filter="slug" (or "all").
   Change PER_PAGE to show more/fewer cards per page.
   Deep link: courses.html?cat=finance */
(function () {
  'use strict';

  var PER_PAGE = 4;

  var list = document.getElementById('courseList');
  var pager = document.getElementById('pager');
  var btns = document.querySelectorAll('.cats__btn');
  if (!list || !pager) return;

  var cards = Array.prototype.slice.call(list.querySelectorAll('.ccard'));
  var filter = 'all';
  var page = 1;

  function matching() {
    return cards.filter(function (c) {
      return filter === 'all' || c.getAttribute('data-cat') === filter;
    });
  }

  function render(scroll) {
    var items = matching();
    var pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
    page = Math.min(Math.max(page, 1), pages);

    cards.forEach(function (c) { c.hidden = true; });
    items.slice((page - 1) * PER_PAGE, page * PER_PAGE).forEach(function (c) { c.hidden = false; });

    btns.forEach(function (b) {
      var on = b.getAttribute('data-filter') === filter;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
    });

    drawPager(pages);

    if (scroll) {
      var top = list.getBoundingClientRect().top + window.scrollY - 100;
      if (top < window.scrollY) window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  function drawPager(pages) {
    pager.innerHTML = '';
    pager.hidden = pages < 2;
    if (pages < 2) return;

    function add(label, target, opts) {
      opts = opts || {};
      var el = document.createElement(opts.current || opts.disabled ? 'span' : 'button');
      el.textContent = label;
      el.className = 'pager__item' + (opts.current ? ' is-current' : '') + (opts.disabled ? ' is-disabled' : '');
      if (opts.current) el.setAttribute('aria-current', 'page');
      if (!opts.current && !opts.disabled) {
        el.type = 'button';
        el.addEventListener('click', function () { page = target; render(true); });
      }
      pager.appendChild(el);
    }

    add('Previous', page - 1, { disabled: page === 1 });
    for (var p = 1; p <= pages; p++) add(String(p), p, { current: p === page });
    add('Next', page + 1, { disabled: page === pages });
  }

  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      filter = b.getAttribute('data-filter');
      page = 1;
      render(false);
    });
  });

  // Optional deep link: ?cat=finance
  try {
    var q = new URLSearchParams(window.location.search).get('cat');
    if (q && document.querySelector('.cats__btn[data-filter="' + q + '"]')) filter = q;
  } catch (e) { /* ignore */ }

  render(false);
})();
