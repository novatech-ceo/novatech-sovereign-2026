/**
 * NOVATECH — Serverless: رصيد Binance (Vercel)
 * يُستدعى من الواجهة عند balanceEndpointVercel.
 * متغيرات البيئة: BINANCE_API_KEY, BINANCE_SECRET
 */
const https = require('https');

function sign(queryString, secret) {
  const crypto = require('crypto');
  return crypto.createHmac('sha256', secret).update(queryString).digest('hex');
}

function binanceAccount(apiKey, secret) {
  if (!secret) return Promise.resolve({ totalUSDT: '—' });
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const sig = sign(query, secret);
  return new Promise((resolve, reject) => {
    const apiPath = '/api/v3/account?' + query + '&signature=' + sig;
    https.get({
      hostname: 'api.binance.com',
      path: apiPath,
      method: 'GET',
      headers: { 'X-MBX-APIKEY': apiKey }
    }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(body);
          if (j.balances) {
            const usdt = (j.balances.find(b => b.asset === 'USDT') || {}).free || '0';
            resolve({ totalUSDT: parseFloat(usdt).toFixed(2) });
          } else resolve({ totalUSDT: '0.00' });
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const apiKey = process.env.BINANCE_API_KEY;
  const secret = process.env.BINANCE_SECRET;
  if (!apiKey || !secret) {
    res.status(200).json({ totalUSDT: '—' });
    return;
  }
  try {
    const data = await binanceAccount(apiKey, secret);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ totalUSDT: '—' });
  }
};
