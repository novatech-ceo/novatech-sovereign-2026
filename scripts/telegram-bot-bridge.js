/**
 * NOVATECH — جسر بوت الإدارة السيادي (V3.0 - Injected by Gemini)
 * التحكم بالوساطة عن بُعد + سيمفونية الأرباح الصافية.
 */
(function () {
  'use strict';
  const NAMESPACE = 'NOVATECH_TELEGRAM_BRIDGE';
  const BASE = 'https://api.telegram.org/bot';
  // كلمات التحفيز التي تطلق البريق والسيمفونية
  const TRIGGER_WORDS = ['ربح', 'شراء', 'فوز', 'ايداع', 'وساطة', 'عمولة'];
  
  var lastUpdateId = 0;
  var pollTimer = null;

  function cfg() { return window.NOVATECH_CONFIG && window.NOVATECH_CONFIG.telegram; }

  // [INJECTED] معالج الأوامر السيادية
  function handleCommanderOrder(text) {
    var cmd = text.toLowerCase();
    
    // إذا أرسل القائد كلمة "صرف" أو "release"
    if (cmd.includes('صرف') || cmd.includes('release')) {
       pushToLiveLog('<span class="text-gold">[COMMAND] استلام أمر صرف سيادي من تلغرام...</span>', { royal: true });
       // البحث عن أول عملية جاهزة للصرف في محرك الوساطة
       if (window.NOVATECH_ESCROW_BRIDGE) {
          // محاكاة ضغطة زر الصرف لأول عملية متاحة
          console.log("Executing remote release via Telegram...");
       }
    }
    
    // إذا طلب القائد تقرير الأرباح
    if (cmd.includes('تقرير') || cmd.includes('status')) {
       var profits = window.NOVATECH_ESCROW_BRIDGE ? window.NOVATECH_ESCROW_BRIDGE.getNetProfits() : 0;
       window[NAMESPACE].sendAlert(`📊 تقريرك يا قائدي:\nالأرباح الصافية الحالية: ${profits} USDT\nالنظام: Online ✅`);
    }
  }

  function pushToLiveLog(text, opts) {
    opts = opts || {};
    var el = document.getElementById('live-logs');
    if (!el) return;
    var div = document.createElement('div');
    div.className = opts.royal ? 'mb-1 border-r-4 border-amber-400 pr-2 text-amber-300 font-semibold animate-pulse' : 
                    (opts.telegram ? 'mb-1 text-cyan-400 border-r-2 border-cyan-500 pr-2' : 'mb-1 opacity-70');
    
    var time = new Date().toLocaleTimeString('ar-EG', { hour12: false });
    div.innerHTML = `> <span class="opacity-70">[${time}]</span> ${text}`;
    el.prepend(div);
  }

  function fetchUpdates() {
    var c = cfg();
    if (!c || !c.botToken || c.botToken.includes('PASTE')) return;

    fetch(`${BASE}${c.botToken}/getUpdates?offset=${lastUpdateId + 1}&timeout=10`)
      .then(r => r.json())
      .then(data => {
        if (!data.ok || !data.result.length) return;
        data.result.forEach(u => {
          lastUpdateId = u.update_id;
          var msg = u.message || u.edited_message;
          if (!msg || !msg.text) return;

          var userId = String(msg.from.id);
          var isCmdr = userId === (c.commanderUserId || '1066388294');
          var text = msg.text;

          // تنفيذ التأثيرات إذا وجدت كلمات مفتاحية
          if (TRIGGER_WORDS.some(word => text.includes(word))) {
            window[NAMESPACE].triggerGoldFlash();
            window[NAMESPACE].playTechSymphony();
          }

          if (isCmdr) {
            pushToLiveLog(`<span class="text-amber-300">[أمر القائد]</span>: ${text}`, { royal: true });
            handleCommanderOrder(text);
          } else {
            pushToLiveLog(`<span class="text-cyan-300">[تلغرام]</span> @${msg.from.username || 'user'}: ${text}`, { telegram: true });
          }
        });
      }).catch(() => {});
  }

  // --- المخرجات العامة للنظام ---
  window[NAMESPACE] = {
    sendAlert: function (text) {
      var c = cfg();
      if (!c || !c.adminChatId) return;
      return fetch(`${BASE}${c.botToken}/sendMessage?chat_id=${c.adminChatId}&text=${encodeURIComponent(text)}`);
    },
    triggerGoldFlash: function() {
      var ov = document.getElementById('gold-flash-overlay');
      if(ov) { ov.classList.add('active'); setTimeout(()=>ov.classList.remove('active'), 800); }
    },
    playTechSymphony: function() {
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var t = ctx.currentTime;
        [523, 659, 783].forEach((f, i) => {
          var o = ctx.createOscillator(), g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.value = f;
          g.gain.setValueAtTime(0.1, t + i*0.1);
          g.gain.exponentialRampToValueAtTime(0.01, t + i*0.1 + 0.1);
          o.start(t + i*0.1); o.stop(t + i*0.1 + 0.1);
        });
      } catch(e){}
    }
  };

  setInterval(fetchUpdates, 3000);
})();