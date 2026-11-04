/* Handles every enquiry form (class "js-enquiry-form") with EmailJS.
   Keys and messages live in js/emailjs-config.js – do not put keys here. */
(function () {
  'use strict';

  var forms = document.querySelectorAll('.js-enquiry-form');
  if (!forms.length) return;

  var cfg = window.EMAILJS_CONFIG || {};
  var msg = cfg.messages || {};

  function isSet(v) { return typeof v === 'string' && v.trim() !== '' && v.indexOf('YOUR_') !== 0; }
  var configured = isSet(cfg.publicKey) && isSet(cfg.serviceId) && isSet(cfg.templateId);

  if (configured && window.emailjs) {
    window.emailjs.init({ publicKey: cfg.publicKey });
  }

  // Success popup (built once, reused by every form)
  var modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modalTitle');
  modal.innerHTML = '<div class="modal__box"><div class="modal__tick"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>' +
    '<h3 id="modalTitle">Thank you!</h3><p></p><button type="button" class="btn btn--grad">Close</button></div>';
  document.body.appendChild(modal);
  var closeBtn = modal.querySelector('button');
  function openModal(text) {
    modal.querySelector('p').textContent = text;
    modal.classList.add('is-open');
    closeBtn.focus();
  }
  function closeModal() { modal.classList.remove('is-open'); }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  forms.forEach(function (form) {
    var status = form.querySelector('.form__status');
    var btn = form.querySelector('button[type="submit"]');
    var urlField = form.querySelector('input[name="page_url"]');
    if (urlField) urlField.value = window.location.href;

    function show(text, type) {
      if (!status) return;
      status.textContent = text;
      status.className = 'form__status' + (type ? ' is-' + type : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // spam trap: real users never see/fill this field
      var trap = form.querySelector('input[name="website"]');
      if (trap && trap.value) return;

      if (!form.checkValidity()) {
        show(msg.invalid || 'Please fill in all required fields.', 'error');
        form.reportValidity();
        return;
      }
      if (!configured || !window.emailjs) {
        show(msg.notConfigured || 'Email service is not configured.', 'error');
        return;
      }

      btn.disabled = true;
      show(msg.sending || 'Sending…', 'info');

      window.emailjs.sendForm(cfg.serviceId, cfg.templateId, form)
        .then(function () {
          show(msg.success || 'Sent!', 'success');
          openModal(msg.success || 'Your enquiry has been sent. We will get back to you shortly.');
          form.reset();
          if (urlField) urlField.value = window.location.href;
        })
        .catch(function (err) {
          if (window.console) console.error('EmailJS error:', err);
          show(msg.error || 'Could not send.', 'error');
        })
        .then(function () { btn.disabled = false; });
    });
  });
})();
