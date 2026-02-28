/**
 * ⛔ سري للخادم فقط — لا تضف هذا الملف أبداً إلى index.html أو أي حزمة واجهة.
 * يستخدمه الخادم (Node/Cloud Function) لطلب رصيد Spot من Binance بتوقيع آمن.
 * يمنع منعاً باتاً طباعة أو تسريب القيمة في المتصفح أو الـ Console.
 */
module.exports = {
  BINANCE_SECRET: "DPwjPs2cKs417S9B5tCIPEQ5ZpAVXOR7PliVJNi4NY0uaHkyMQLGCJVRkojqxuXe"
};
