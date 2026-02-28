/**
 * NOVATECH — نظام الوساطة الذكي (Escrow Intelligence V2.0)
 * التوجيه: لا تسليم للمال إلا بعد تأكيد الاستلام + اقتطاع أرباح الوساطة الصافية.
 */
(function () {
  'use strict';
  
  // الإعدادات السيادية
  var COMMISSION_RATE = 0.005; // 0.5% كما حددنا للوساطة
  var netProfits = parseFloat(localStorage.getItem('novatech_escrow_net_profits') || '0');
  var rates = { USDT: 1, IQD: 1310 };

  // قائمة العمليات (يمكن جلبها مستقبلاً من API)
  var escrowDeals = [
    { id: 'E001', label: 'شحنة إلكترونيات #E001', amount: 1200, currency: 'USDT' },
    { id: 'E002', label: 'توريد معدات #E002', amount: 850, currency: 'USDT' },
    { id: 'E003', label: 'صفقة وساطة #E003', amount: 2100, currency: 'USDT' },
    { id: 'E004', label: 'مبيعات محلي (IQD)', amount: 1310000, currency: 'IQD' }
  ];

  // --- وظائف المساعدة ---
  function amountToUsdt(amount, currency) {
    return currency === 'IQD' ? amount / (rates.IQD || 1310) : amount;
  }

  function pushToLiveLog(html, isSuccess) {
    var el = document.getElementById('live-logs');
    if (!el) return;
    var div = document.createElement('div');
    div.className = isSuccess ? 'mb-1 text-green-400' : 'mb-1 text-gold';
    var time = new Date().toLocaleTimeString('ar-EG', { hour12: false });
    div.innerHTML = `> <span class="opacity-70">[${time}]</span> ${html}`;
    el.prepend(div);
  }

  // --- منطق الحالة (Persistence) ---
  function getStatus(id) {
    return {
      received: localStorage.getItem('novatech_escrow_ok_' + id) === '1',
      released: localStorage.getItem('novatech_escrow_released_' + id) === '1',
      endTime: parseInt(localStorage.getItem('novatech_escrow_end_' + id) || (Date.now() + 172800000))
    };
  }

  // --- العمليات الأساسية ---
  function confirmArrival(id) {
    localStorage.setItem('novatech_escrow_ok_' + id, '1');
    pushToLiveLog(`[CONFIRMED] تم تأكيد وصول المنتج للعملية ${id}. بانتظار أمر الصرف.`, false);
    renderEscrow();
    // تنبيه تلغرام (Injected)
    if(window.NOVATECH_TELEGRAM_BRIDGE) window.NOVATECH_TELEGRAM_BRIDGE.sendAlert(`✅ المنتج وصل! العملية ${id} جاهزة لتسليم المبلغ.`);
  }

  function releaseFunds(id, amount, currency) {
    var status = getStatus(id);
    if (!status.received) {
        alert("تنبيه أمني: لا يمكن صرف المبلغ قبل تأكيد وصول المنتج!");
        return;
    }

    localStorage.setItem('novatech_escrow_released_' + id, '1');
    
    // حساب الأرباح (الوساطة الصافية)
    var amountUsdt = amountToUsdt(amount, currency);
    var fee = amountUsdt * COMMISSION_RATE;
    netProfits += fee;
    
    localStorage.setItem('novatech_escrow_net_profits', netProfits.toFixed(2));
    
    pushToLiveLog(`[RELEASED] تم تسليم المبلغ ${amount} ${currency}. عمولة الوساطة: +${fee.toFixed(2)} USDT`, true);
    
    // تحديث سجل المجد
    updateGloryLog(fee, `عمولة وساطة ${id}`);
    renderEscrow();
  }

  function updateGloryLog(fee, label) {
    try {
      var log = JSON.parse(localStorage.getItem('novatech_glory_log') || '[]');
      log.unshift({ amount: fee, label: label, time: new Date().toISOString() });
      localStorage.setItem('novatech_glory_log', JSON.stringify(log.slice(0, 100)));
    } catch (e) { console.error("Glory Log Error", e); }
  }

  // --- الواجهة ---
  function renderEscrow() {
    var container = document.getElementById('escrow-deals-list');
    var netEl = document.getElementById('escrow-net-profits-value');
    if (netEl) netEl.textContent = netProfits.toFixed(2) + ' USDT';
    if (!container) return;

    container.innerHTML = '';
    escrowDeals.forEach(function (d) {
      var status = getStatus(id);
      var id = d.id;
      var st = getStatus(id);
      
      var card = document.createElement('div');
      card.className = `border border-gray-700 rounded-lg p-3 bg-black/40 mb-2 ${st.released ? 'opacity-50' : ''}`;
      
      var actionButtons = '';
      if (st.released) {
        actionButtons = '<span class="text-green-500 font-bold text-xs">✓ العملية مكتملة</span>';
      } else if (!st.received) {
        actionButtons = `<button onclick="window.NOVATECH_ESCROW_BRIDGE.confirm('${id}')" class="bg-amber-600/20 border border-amber-600 text-amber-400 px-3 py-1 rounded text-[10px] hover:bg-amber-600 hover:text-white transition">تأكيد وصول المنتج</button>`;
      } else {
        actionButtons = `<button onclick="window.NOVATECH_ESCROW_BRIDGE.release('${id}', ${d.amount}, '${d.currency}')" class="bg-green-600 border border-green-500 text-white px-3 py-1 rounded text-[10px] shadow-[0_0_10px_rgba(34,197,94,0.5)]">تسليم المبلغ (آمن)</button>`;
      }

      card.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <span class="text-neon-blue font-mono text-xs">${d.label}</span>
          <span class="text-gold font-bold text-xs">${d.amount} ${d.currency}</span>
        </div>
        <div class="flex justify-between items-center mt-3">
           <div class="text-[9px] text-gray-500 font-mono">ID: ${id}</div>
           ${actionButtons}
        </div>
      `;
      container.appendChild(card);
    });
  }

  // التصدير العالمي للتحكم
  window.NOVATECH_ESCROW_BRIDGE = {
    confirm: confirmArrival,
    release: releaseFunds,
    refresh: renderEscrow
  };

  // البداية
  document.addEventListener('DOMContentLoaded', renderEscrow);
})();