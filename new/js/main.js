(function () {
  'use strict';

  var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var toTop = document.getElementById('toTop');

  // Scroll progress bar
  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);
  function progress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
  }
  window.addEventListener('scroll', progress, { passive: true });
  progress();

  // Stagger reveal delays for sibling cards + alternate directions in two-column rows
  document.querySelectorAll('.reveal').forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains('reveal'); });
    if (sibs.length > 1 && !el.classList.contains('stair')) {
      el.style.transitionDelay = (Math.min(sibs.indexOf(el), 5) * 110) + 'ms';
    }
    if (el.matches('.offer__text,.pget__text,.rpproc__img')) el.classList.add('reveal--left');
    if (el.matches('.offer__media,.pget__img,.rpauthor__card img')) el.classList.add('reveal--right');
    if (el.matches('.paper,.rprel__card,.scard')) el.classList.add('reveal--zoom');
  });

  // Page transition: fade out before following an internal link
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.addEventListener('pageshow', function () { document.body.classList.remove('leaving'); });
  if (!reduceMotion) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (a.protocol !== window.location.protocol || a.host !== window.location.host) return;
      if (a.pathname === window.location.pathname && a.search === window.location.search) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(function () { window.location.href = a.href; }, 250);
    });
  }

  // Mobile sticky "Enquire Now" bar (not on the contact page)
  if (!/contact\.html$/.test(window.location.pathname)) {
    var cta = document.createElement('a');
    cta.className = 'sticky-cta';
    cta.href = 'contact.html';
    cta.textContent = 'Enquire Now';
    document.body.appendChild(cta);
    window.addEventListener('scroll', function () { cta.classList.toggle('show', window.scrollY > 300); }, { passive: true });
  }

  // Back-to-top button visibility
  window.addEventListener('scroll', function () {
    toTop.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Mobile menu
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });

  // Mobile dropdowns: first tap opens the submenu
  document.querySelectorAll('.has-sub > a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (window.innerWidth <= 860) {
        var li = a.parentElement;
        if (!li.classList.contains('open')) {
          e.preventDefault();
          li.classList.add('open');
        }
      }
    });
  });

  // Close mobile menu on in-page links
  nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          (function (t) { setTimeout(function () { t.style.transitionDelay = ''; }, 1600); })(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) {
      if (el.classList.contains('stair')) {
        el.style.transitionDelay = (Array.prototype.indexOf.call(el.parentNode.children, el) * 120) + 'ms';
      }
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Animated counters
  function animate(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var dur = 1600, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animate(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
  }
})();
