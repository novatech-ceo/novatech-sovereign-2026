/**
 * NOVATECH — Telegram Webhook Reset
 * GET /api/tg-delete-webhook — يحذف أي Webhook قديم ليتوقف خطأ 409
 * يعتمد على TELEGRAM_BOT_TOKEN في متغيرات Vercel.
 */
const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    res.status(200).json({ ok: false, error: 'TELEGRAM_BOT_TOKEN not set' });
    return;
  }

  const urlPath = `/bot${token}/deleteWebhook?drop_pending_updates=true`;
  const options = {
    hostname: 'api.telegram.org',
    path: urlPath,
    method: 'GET'
  };

  https.get(options, (tgRes) => {
    let body = '';
    tgRes.on('data', (c) => body += c);
    tgRes.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        res.status(200).json(parsed);
      } catch (e) {
        res.status(200).json({ ok: false, raw: body });
      }
    });
  }).on('error', (err) => {
    res.status(200).json({ ok: false, error: err.message });
  });
};

