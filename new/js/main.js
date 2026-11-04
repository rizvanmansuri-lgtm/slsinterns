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
  // Smooth scrolling (own easing, so it also works when the OS has animations turned off)
  var scrollRaf = null;
  function smoothScrollTo(y, dur) {
    var root = document.documentElement;
    var from = window.pageYOffset, dist = y - from, t0 = null;
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    if (Math.abs(dist) < 2) return;
    dur = dur || Math.min(1100, Math.max(500, Math.abs(dist) * 0.45));
    root.style.scrollBehavior = 'auto';
    function stopAnim() {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      scrollRaf = null; root.style.scrollBehavior = '';
      window.removeEventListener('wheel', stopAnim); window.removeEventListener('touchstart', stopAnim);
    }
    window.addEventListener('wheel', stopAnim, { passive: true });
    window.addEventListener('touchstart', stopAnim, { passive: true });
    function frame(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      window.scrollTo(0, from + dist * e);
      if (p < 1 && scrollRaf) scrollRaf = requestAnimationFrame(frame); else stopAnim();
    }
    scrollRaf = requestAnimationFrame(frame);
  }
  toTop.addEventListener('click', function () { smoothScrollTo(0); });

  // In-page links (#offer, #research ...) glide to their section below the sticky header
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) { if (a.hasAttribute('data-social') || a.hasAttribute('data-brochure')) e.preventDefault(); return; }
    var t = document.getElementById(id);
    if (!t) return;
    e.preventDefault();
    smoothScrollTo(t.getBoundingClientRect().top + window.pageYOffset - (header ? header.offsetHeight : 0));
    if (history.replaceState) history.replaceState(null, '', '#' + id);
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

/* ---- Site config: social links, brochure, WhatsApp button (values live in js/site-config.js) ---- */
(function () {
  'use strict';
  var cfg = window.SITE_CONFIG || {};

  ['facebook', 'instagram', 'linkedin', 'youtube', 'x'].forEach(function (k) {
    if (!cfg[k]) return;
    document.querySelectorAll('a[data-social="' + k + '"]').forEach(function (a) {
      a.href = cfg[k]; a.target = '_blank'; a.rel = 'noopener noreferrer';
    });
  });

  if (cfg.brochure) {
    document.querySelectorAll('a[data-brochure]').forEach(function (a) { a.href = cfg.brochure; });
  }

  if (cfg.whatsappNumber) {
    var wa = document.createElement('a');
    wa.className = 'wa';
    wa.href = 'https://wa.me/' + String(cfg.whatsappNumber).replace(/[^0-9X]/gi, '') +
      '?text=' + encodeURIComponent(cfg.whatsappMessage || '');
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    wa.setAttribute('aria-label', 'Chat with us on WhatsApp');
    wa.innerHTML = '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><path fill="#fff" d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.8 2 6.8L3 29l6.6-1.9c1.9 1 4 1.5 6.3 1.5 7.2 0 13-5.7 13-12.8S23.200 3 16 3zm0 23.300c-2 0-3.900-.5-5.600-1.500l-.4-.2-3.900 1.100 1.100-3.800-.3-.4A10.300 10.300 0 0 1 5.600 15.800C5.600 10.100 10.200 5.500 16 5.500s10.400 4.600 10.400 10.300S21.700 26.300 16 26.300z"/><path fill="#fff" d="M21.700 18.600c-.3-.2-1.900-.9-2.200-1-.3-.1-.5-.2-.7.200-.2.300-.8 1-1 1.200-.2.200-.4.200-.7.100-.3-.2-1.300-.5-2.500-1.500-.9-.8-1.500-1.800-1.700-2.100-.2-.3 0-.5.100-.6l.5-.5c.2-.2.200-.3.300-.5.100-.2.100-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400-.3.300-1.100 1.100-1.100 2.600s1.100 3 1.300 3.200c.2.200 2.200 3.300 5.300 4.600 2.600 1 3.100.8 3.600.8.600-.1 1.900-.8 2.100-1.500.3-.7.300-1.400.2-1.500-.1-.1-.3-.2-.6-.4z"/></svg>';
    document.body.appendChild(wa);
  }
})();
