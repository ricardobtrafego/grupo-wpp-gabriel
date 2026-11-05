(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const active = config.mode === 'live' && /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(config.endpoint || '');
  const form = document.querySelector('#lead-form');
  const phone = document.querySelector('#phone');
  const name = document.querySelector('#name');
  const status = document.querySelector('#form-status');
  const help = document.querySelector('#form-help');
  const submit = form.querySelector('[type="submit"]');
  const dialog = document.querySelector('#privacy-dialog');
  let busy = false;
  let requestId = null;
  const digits = value => String(value).replace(/\D/g, '');
  const normalizePhone = value => {
    const valueDigits = digits(value);
    return valueDigits.length === 13 && valueDigits.startsWith('55') ? valueDigits.slice(2) : valueDigits;
  };
  const validName = () => name.value.trim().replace(/[^\p{L}]/gu, '').length >= 2 && name.value.trim().length <= 80;
  const validPhone = () => /^[1-9]{2}9\d{8}$/.test(normalizePhone(phone.value));
  const updateButton = () => {
    const ready = validName() && validPhone();
    submit.disabled = busy || !ready;
    submit.setAttribute('aria-busy', String(busy));
    help.textContent = ready ? 'Tudo pronto para continuar.' : 'Preencha nome e WhatsApp para continuar.';
  };
  phone.addEventListener('input', () => {
    phone.setCustomValidity('');
    const number = normalizePhone(phone.value).slice(0, 11);
    phone.value = number.length > 7 ? `(${number.slice(0, 2)}) ${number.slice(2, 7)}-${number.slice(7)}` : number.length > 2 ? `(${number.slice(0, 2)}) ${number.slice(2)}` : number;
  });
  name.addEventListener('input', () => name.setCustomValidity(''));
  form.addEventListener('input', () => { requestId = null; status.textContent = ''; updateButton(); });
  form.addEventListener('change', updateButton);
  form.addEventListener('focusin', () => queueMicrotask(updateButton));
  form.addEventListener('reset', () => queueMicrotask(updateButton));
  window.addEventListener('pageshow', updateButton);
  document.querySelectorAll('.privacy-open').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  if (active) {
    document.querySelector('#preview-note').hidden = true;
    document.querySelector('#preview-privacy').hidden = true;
  } else {
    status.textContent = '';
  }
  updateButton();
  const track = (eventName, detail = {}) => {
    // Somente eventos sem nome, telefone ou outros dados pessoais.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...detail });
  };
  document.querySelectorAll('a[href="#participar"]').forEach(link => link.addEventListener('click', () => track('cta_click')));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    updateButton();
    if (submit.disabled || busy) return;
    name.value = name.value.trim();
    if (!validName()) { name.setCustomValidity('Informe seu nome com pelo menos duas letras.'); name.reportValidity(); return; }
    const nationalPhone = normalizePhone(phone.value);
    if (!/^[1-9]{2}9\d{8}$/.test(nationalPhone)) { phone.setCustomValidity('Informe um celular com DDD e nove dígitos, como (11) 99999-9999.'); phone.reportValidity(); return; }
    if (!form.reportValidity()) return;
    if (document.querySelector('#website').value) return;
    track('cta_click', { placement: 'form' });
    if (!active) {
      status.textContent = 'Seus dados estão válidos. Esta é uma prévia: o cadastro ainda não está aberto e nenhum dado foi enviado.';
      return;
    }
    busy = true;
    updateButton();
    submit.querySelector('span').textContent = 'Enviando seu cadastro…';
    status.textContent = '';
    requestId = requestId || crypto.randomUUID();
    // Consent is expressed by submitting with the adjacent notice, never by filling fields.
    const body = new URLSearchParams({ name: name.value, phone: '55' + nationalPhone, consent: 'yes', consent_version: '2026-11-03-v4-group', request_id: requestId, website: '' });
    const params = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => body.set(key, (params.get(key) || '').slice(0, 200)));
    try {
      const response = await fetch(config.endpoint, { method: 'POST', body, redirect: 'follow', signal: AbortSignal.timeout(20000), credentials: 'omit' });
      if (!response.ok) throw new Error('HTTP error');
      const result = await response.json();
      const invite = new URL(result.invite_url || '');
      if (result.ok !== true || invite.protocol !== 'https:' || invite.hostname !== 'chat.whatsapp.com' || invite.username || invite.password || !/^\/[A-Za-z0-9_-]+\/?$/.test(invite.pathname)) throw new Error('Invalid response');
      const link = document.querySelector('#group-invite');
      link.href = invite.href;
      link.addEventListener('click', () => track('whatsapp_invite_click'), { once: true });
      document.querySelector('#form-content').hidden = true;
      document.querySelector('#success').hidden = false;
      document.querySelector('#success h3').tabIndex = -1;
      document.querySelector('#success h3').focus();
      form.reset();
      track('lead_saved');
    } catch {
      status.textContent = 'Não foi possível confirmar seu cadastro. Confira sua conexão e tente novamente. O convite só é liberado após a confirmação.';
      track('lead_error');
    } finally {
      busy = false;
      updateButton();
      submit.querySelector('span').textContent = 'Entrar no grupo agora';
    }
  });
})();
