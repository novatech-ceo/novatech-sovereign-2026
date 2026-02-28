/**
 * NOVATECH FOUNDER HOLDINGS LTD — الثوابت القانونية والسيادية
 * ⚠️ يمنع المساس أو التعديل إلا بأمر مباشر من القيادة.
 * المرجع: الدستور الرقمي — النواة السيادية.
 */

const NOVATECH_SOVEREIGN = Object.freeze({
  REGISTRATION_NUMBER: "16945629",
  LEGAL_NAME: "NOVATECH FOUNDER HOLDINGS LTD",
  CEO: "K. H. J. AL-NAFFAKH",
  ADDRESS: "321-323 High Road, Essex, UK",
  CONTACT: "+447482790489",
  SECURE_NODE_ID: "13282833152",
  TAX_ID: "16945629"
});

/** الحسابات المالية السيادية — للعرض في الواجهة فقط؛ لا تعديل دون أمر. */
const NOVATECH_ACCOUNTS = Object.freeze({
  ALRAFIDAIN: "1953549134",
  FIB: "...220610001",
  ZAIN_CASH: "07813105317",
  ASIA_HAWALA: "07725269028"
});

/** إعدادات التكامل — تُملأ من بيئة النشر أو لوحة القيادة. */
const NOVATECH_CONFIG = {
  firebase: {
    apiKey: "YOUR_API_KEY",
    projectId: "novatech-system",
    storageBucket: "novatech-backups-2026.appspot.com",
    databaseURL: "https://novatech-system-default-rtdb.europe-west1.firebasedatabase.app"
  },
  telegram: {
    botToken: "8288631881:AAH7S0uFA295hnjQ75dHhimduAYYZZp-daE",
    adminChatId: "1066388294",
    systemOnlineEnabled: true,
    commanderUserId: "1066388294"
  },
  cloudflare: { zoneId: "", apiToken: "" },
  binance: {
    apiKey: "DFnZIf0xTJONE0paQECuYDwaKdAVMn66bJf1z1gdeExKkHbERfII54unCPZpESIy",
    balanceEndpoint: "http://localhost:3080/api/balance",
    balanceEndpointVercel: "https://YOUR_VERCEL_PROJECT.vercel.app/api/balance"
  },
  vaultPassword: "",
  escrowCommissionRate: 0.005
};
// vaultPassword: إن تركت فارغاً تُستخدم كلمة المرور الافتراضية NOVATECH2026 للخزينة وتدمير الجلسة.
// ⛔ لا تضف مفتاح Binance السري (Secret) هنا أبداً — يُحفظ في config/binance-secret.server.js للخادم فقط.

// تصدير للاستخدام في السكربتات المستقبلية
if (typeof window !== 'undefined') {
  window.NOVATECH_SOVEREIGN = NOVATECH_SOVEREIGN;
  window.NOVATECH_ACCOUNTS = NOVATECH_ACCOUNTS;
  window.NOVATECH_CONFIG = NOVATECH_CONFIG;
}
