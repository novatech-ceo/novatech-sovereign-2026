/**
 * NOVATECH — سجل المجد (Glory Ledger V4.0)
 * المزامنة السحابية مع Firebase لضمان خلود البيانات المالية.
 */
(function () {
  'use strict';
  const NAMESPACE = 'NOVATECH_GLORY_LEDGER';

  // دالة المزامنة مع Firebase (سيتم ملء الإعدادات بواسطة الوكيل)
  async function syncWithCloud(profitValue) {
    if (typeof db === 'undefined') {
       console.warn("[SYSTEM] Firebase not initialized. Saving to LocalStorage only.");
       return;
    }
    try {
      // حفظ الأرباح الصافية في المسار السيادي
      await db.ref('sovereign/global_stats/net_profits').set({
        amount: profitValue,
        last_update: new Date().toISOString(),
        commander_id: '1066388294'
      });
      console.log("[CLOUD] تم تأمين الأرباح في السحابة بنجاح.");
    } catch (e) {
      console.error("[CLOUD ERROR]", e);
    }
  }

  // مراقبة التغيرات في ملف الوساطة (Injected Listener)
  function startGloryWatching() {
    // كل 10 ثوانٍ، نتحقق إذا زادت الأرباح لنرفعها للسحابة
    setInterval(() => {
      if (window.NOVATECH_ESCROW_BRIDGE) {
        var currentProfits = window.NOVATECH_ESCROW_BRIDGE.getNetProfits();
        var lastSynced = parseFloat(localStorage.getItem('last_synced_profit') || '0');

        if (currentProfits > lastSynced) {
          localStorage.setItem('last_synced_profit', currentProfits);
          syncWithCloud(currentProfits);

          // إرسال إشارة بصرية لسجل المجد في الواجهة
          if (window.NOVATECH_TELEGRAM_BRIDGE) {
             window.NOVATECH_TELEGRAM_BRIDGE.pushToLiveLog(
               `<span class="text-gold font-bold">[GLORY] تم تخليد ربح جديد: +${(currentProfits - lastSynced).toFixed(2)} USDT</span>`,
               { royal: true }
             );
          }
        }
      }
    }, 10000);
  }

  window[NAMESPACE] = {
    init: startGloryWatching,
    forceSync: function() {
       var p = window.NOVATECH_ESCROW_BRIDGE ? window.NOVATECH_ESCROW_BRIDGE.getNetProfits() : 0;
       syncWithCloud(p);
    }
  };

  // تشغيل المحرك عند جاهزية الوثيقة
  document.addEventListener('DOMContentLoaded', startGloryWatching);
})();
