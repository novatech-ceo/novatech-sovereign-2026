/**
 * NOVATECH — جسر Cloudflare (DNS / WAF / CDN)
 * ربط لوحة القيادة مع Cloudflare للتحكم في النطاق والحماية.
 * استدعاءات API تتم من خلفية آمنة؛ لا تعريض API Token في الواجهة.
 */
(function () {
  'use strict';
  const NAMESPACE = 'NOVATECH_CLOUDFLARE_BRIDGE';

  window[NAMESPACE] = {
    dashboardUrl: 'https://dash.cloudflare.com',
    openDashboard: function () { window.open(this.dashboardUrl, '_blank'); },
    /** استدعاء بروكسي خلفيتكم لـ Cloudflare API عند الحاجة. */
    proxyRequest: function (path, options) {
      var proxy = (window.NOVATECH_CONFIG && window.NOVATECH_CONFIG.cloudflareProxy) || '';
      if (!proxy) return Promise.resolve(null);
      return fetch(proxy + path, options || {}).then(function (r) { return r.json(); }).catch(function () { return null; });
    }
  };
})();
