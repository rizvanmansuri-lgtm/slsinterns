/* Handles every enquiry form (class "js-enquiry-form"):
   1) inline validation (messages under each field, checked on blur / input / submit)
   2) sending through EmailJS.
   Keys and send messages live in js/emailjs-config.js – do not put keys here. */
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

  /* ---------- validation rules (edit messages / limits here) ---------- */
  var EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
  var NAME_RE = /^[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ .'\-]*$/;

  var rules = {
    from_name: function (v) {
      if (!v) return 'Please enter your full name.';
      if (v.length < 2) return 'Name must be at least 2 characters.';
      if (v.length > 60) return 'Name must be 60 characters or fewer.';
      if (!NAME_RE.test(v)) return 'Name can only contain letters, spaces, . \' and -';
      return '';
    },
    mobile: function (v) {
      if (!v) return 'Please enter your mobile number.';
      var d = v.replace(/[\s\-()]/g, '');
      // Indian mobile: optional +91 / 91 / 0, then 10 digits starting 6-9
      if (/^(?:\+?91|0)?[6-9]\d{9}$/.test(d)) return '';
      // other countries: + and 8-15 digits
      if (/^\+\d{8,15}$/.test(d)) return '';
      if (/[^\d+]/.test(d)) return 'Mobile number can only contain digits, spaces and +.';
      return 'Enter a valid 10-digit mobile number (or +country code).';
    },
    from_email: function (v) {
      if (!v) return 'Please enter your email address.';
      if (v.length > 254 || !EMAIL_RE.test(v)) return 'Enter a valid email address, e.g. name@example.com.';
      return '';
    },
    subject: function (v) {
      if (!v) return 'Please enter a subject.';
      if (v.length < 3) return 'Subject must be at least 3 characters.';
      if (v.length > 120) return 'Subject must be 120 characters or fewer.';
      return '';
    },
    message: function (v) {
      if (!v) return 'Please describe your requirement.';
      if (v.length < 10) return 'Please write at least 10 characters.';
      if (v.length > 1000) return 'Requirement must be 1000 characters or fewer (now ' + v.length + ').';
      return '';
    },
    travel_support: function (v) {
      return v ? '' : 'Please choose Yes or No.';
    }
  };

  var uid = 0;

  forms.forEach(function (form) {
    form.noValidate = true; // we show our own messages instead of the browser bubbles

    var status = form.querySelector('.form__status');
    var btn = form.querySelector('button[type="submit"]');
    var urlField = form.querySelector('input[name="page_url"]');
    if (urlField) urlField.value = window.location.href;

    function show(text, type) {
      if (!status) return;
      status.textContent = text;
      status.className = 'form__status' + (type ? ' is-' + type : '');
    }

    /* each validated "field" = { name, wrap, inputs[], err } */
    var fields = [];
    Object.keys(rules).forEach(function (name) {
      var inputs = Array.prototype.slice.call(form.querySelectorAll('[name="' + name + '"]'));
      if (!inputs.length) return;
      var wrap = inputs[0].closest('.field');
      if (!wrap) return;
      var err = document.createElement('p');
      err.className = 'field__error';
      err.id = 'err-' + name + '-' + (++uid);
      err.setAttribute('role', 'alert');
      err.hidden = true;
      wrap.appendChild(err);
      inputs.forEach(function (i) {
        i.setAttribute('aria-describedby', err.id);
        i.removeAttribute('pattern'); // our rules replace the loose HTML pattern
      });
      fields.push({ name: name, wrap: wrap, inputs: inputs, err: err });
    });

    function valueOf(f) {
      if (f.inputs[0].type === 'radio') {
        var on = f.inputs.filter(function (i) { return i.checked; })[0];
        return on ? on.value : '';
      }
      return f.inputs[0].value.trim();
    }

    function check(f) {
      var problem = rules[f.name](valueOf(f));
      f.wrap.classList.toggle('is-invalid', !!problem);
      f.inputs.forEach(function (i) { i.setAttribute('aria-invalid', problem ? 'true' : 'false'); });
      f.err.textContent = problem;
      f.err.hidden = !problem;
      return !problem;
    }

    fields.forEach(function (f) {
      var touched = false;
      f.inputs.forEach(function (i) {
        var isRadio = i.type === 'radio';
        i.addEventListener(isRadio ? 'change' : 'blur', function () { touched = true; check(f); });
        if (!isRadio) {
          i.addEventListener('input', function () {
            // once a field has been checked, keep feedback live while typing
            if (touched || f.wrap.classList.contains('is-invalid')) check(f);
          });
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // spam trap: real users never see/fill this field
      var trap = form.querySelector('input[name="website"]');
      if (trap && trap.value) return;

      var firstBad = null;
      fields.forEach(function (f) {
        if (!check(f) && !firstBad) firstBad = f;
      });
      if (firstBad) {
        show(msg.invalid || 'Please correct the highlighted fields.', 'error');
        firstBad.inputs[0].focus();
        return;
      }

      if (!configured || !window.emailjs) {
        show(msg.notConfigured || 'Email service is not configured.', 'error');
        return;
      }

      // send trimmed values
      fields.forEach(function (f) {
        if (f.inputs[0].type !== 'radio') f.inputs[0].value = f.inputs[0].value.trim();
      });

      btn.disabled = true;
      show(msg.sending || 'Sending…', 'info');

      window.emailjs.sendForm(cfg.serviceId, cfg.templateId, form)
        .then(function () {
          show(msg.success || 'Sent!', 'success');
          form.reset();
          fields.forEach(function (f) {
            f.wrap.classList.remove('is-invalid');
            f.err.hidden = true;
            f.inputs.forEach(function (i) { i.removeAttribute('aria-invalid'); });
          });
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
