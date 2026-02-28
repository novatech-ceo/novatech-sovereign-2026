/**
 * NOVATECH — جسر الهوية القانونية (Legal Vault)
 * زر مخفي بدرع ذهبي؛ يفتح بكلمة مرور فقط، يعرض المستندات السيادية.
 */
(function () {
  'use strict';
  function getConfig() {
    return window.NOVATECH_CONFIG || {};
  }
  function getVaultPassword() {
    var c = getConfig();
    return (c.vaultPassword || '').trim() || 'NOVATECH2026';
  }
  function checkPassword(input) {
    return String(input).trim() === getVaultPassword();
  }
  function showPasswordModal() {
    var m = document.getElementById('vault-password-modal');
    if (m) m.classList.remove('hidden');
    var inp = document.getElementById('vault-password-input');
    if (inp) { inp.value = ''; inp.focus(); }
  }
  function hidePasswordModal() {
    var m = document.getElementById('vault-password-modal');
    if (m) m.classList.add('hidden');
  }
  function showVaultModal() {
    hidePasswordModal();
    var m = document.getElementById('legal-vault-modal');
    if (m) m.classList.remove('hidden');
  }
  function hideVaultModal() {
    var m = document.getElementById('legal-vault-modal');
    if (m) m.classList.add('hidden');
  }
  function onSubmitPassword(e) {
    e.preventDefault();
    var inp = document.getElementById('vault-password-input');
    var err = document.getElementById('vault-password-error');
    if (!inp) return;
    if (checkPassword(inp.value)) {
      if (err) err.classList.add('hidden');
      showVaultModal();
    } else {
      if (err) { err.classList.remove('hidden'); err.textContent = 'كلمة المرور غير صحيحة.'; }
      if (window.NOVATECH_TELEGRAM_BRIDGE && typeof window.NOVATECH_TELEGRAM_BRIDGE.sendAlert === 'function') {
        window.NOVATECH_TELEGRAM_BRIDGE.sendAlert('🔴 إنذار أحمر: محاولة دخول غير مصرح بها للخزنة السيادية! البوت 8288631881.');
      }
    }
  }
  var btn = document.getElementById('legal-vault-trigger');
  if (btn) btn.addEventListener('click', showPasswordModal);
  document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'vault-password-form') onSubmitPassword(e);
  });
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'legal-vault-close') hideVaultModal();
    if (e.target && e.target.id === 'vault-password-cancel') hidePasswordModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { hidePasswordModal(); hideVaultModal(); }
  });
})();
