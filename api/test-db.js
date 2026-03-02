/**
 * NOVATECH — Firebase Health Check
 * GET /api/test-db — يجلب القيمة من المسار sovereign/global_stats/net_profits
 * الهدف: تأكيد أن الجسر مع Realtime Database يعمل (يُتوقع 28.98).
 */
const https = require('https');

function getDatabaseUrl() {
  const base = process.env.FIREBASE_DATABASE_URL || 'https://novatech-sovereign-2026-default-rtdb.europe-west1.firebasedatabase.app';
  return base.replace(/\/+$/, '');
}

function fetchPath(path) {
  const url = getDatabaseUrl() + path;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const value = await fetchPath('/sovereign/global_stats/net_profits.json');
  res.status(200).json({
    path: 'sovereign/global_stats/net_profits',
    value
  });
};

