/**
 * خادم آمن لرصيد Binance Spot — يشغّل محلياً (Node).
 * يقرأ المفتاح السري من config/binance-secret.server.js فقط؛ لا يُرسل إلى المتصفح أبداً.
 * تشغيل: node scripts/server-binance-balance.js
 * ثم ضع في constants.js: binance.balanceEndpoint = "http://localhost:3080/api/balance"
 */
const http = require('http');
const https = require('https');

let secretModule;
var path = require('path');
var secretPath = path.join(__dirname, '..', 'config', 'binance-secret.server.js');
try {
  secretModule = require(secretPath);
} catch (e) {
  console.error('لم يتم العثور على config/binance-secret.server.js');
  process.exit(1);
}
const BINANCE_SECRET = secretModule.BINANCE_SECRET;
const API_KEY = 'DFnZIf0xTJONE0paQECuYDwaKdAVMn66bJf1z1gdeExKkHbERfII54unCPZpESIy';

function sign(queryString) {
  const crypto = require('crypto');
  return crypto.createHmac('sha256', BINANCE_SECRET).update(queryString).digest('hex');
}

function binanceAccount() {
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const sig = sign(query);
  return new Promise((resolve, reject) => {
    const path = '/api/v3/account?' + query + '&signature=' + sig;
    const opt = {
      hostname: 'api.binance.com',
      path: path,
      method: 'GET',
      headers: { 'X-MBX-APIKEY': API_KEY }
    };
    https.get(opt, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(body);
          if (j.balances) {
            let totalUSDT = 0;
            const usdt = (j.balances.find(b => b.asset === 'USDT') || {}).free || '0';
            totalUSDT = parseFloat(usdt);
            resolve({ totalUSDT: totalUSDT.toFixed(2) });
          } else resolve({ totalUSDT: '0.00' });
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

const server = http.createServer((req, res) => {
  if (req.url !== '/api/balance' || req.method !== 'GET') {
    res.writeHead(404);
    res.end();
    return;
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  binanceAccount()
    .then((data) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    })
    .catch(() => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ totalUSDT: '—' }));
    });
});
const PORT = 3080;
server.listen(PORT, () => console.log('NOVATECH Binance balance server on http://localhost:' + PORT + '/api/balance'));
