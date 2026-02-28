/**
 * NOVATECH — جسر Firebase (NEXUS v4.0)
 * التزامن مع سيرفرات لندن والنسخ الاحتياطي.
 * يُربط من index.html عند تفعيل الإعدادات.
 * يدعم Firestore و Realtime Database (لربط glory-ledger.js).
 */
(function () {
  'use strict';
  if (typeof firebase === 'undefined') return;
  const NAMESPACE = 'NOVATECH_FIREBASE_BRIDGE';

  window[NAMESPACE] = {
    init: function (config) {
      if (!config || !config.apiKey) return null;
      try {
        var app = firebase.initializeApp(config);
        if (config.databaseURL && firebase.database) {
          try {
            window.db = firebase.database(app);
          } catch (e) {}
        }
        return app;
      } catch (e) {
        console.warn(NAMESPACE, e.message);
        var app = firebase.app();
        if (app.options && app.options.databaseURL && firebase.database) {
          try { window.db = firebase.database(app); } catch (err) {}
        }
        return app;
      }
    },
    firestore: function () {
      return typeof firebase !== 'undefined' && firebase.firestore ? firebase.firestore() : null;
    },
    pushLog: function (message) {
      var db = this.firestore();
      if (db && window.NOVATECH_SOVEREIGN)
        db.collection('nexus_logs').add({
          msg: message,
          nodeId: window.NOVATECH_SOVEREIGN.SECURE_NODE_ID,
          ts: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(function () {});
    }
  };

  var cfg = (typeof window.NOVATECH_CONFIG !== 'undefined' && window.NOVATECH_CONFIG.firebase) ? window.NOVATECH_CONFIG.firebase : null;
  if (cfg && cfg.apiKey && cfg.apiKey !== 'YOUR_API_KEY' && cfg.databaseURL) {
    window[NAMESPACE].init(cfg);
  }
})();
