# NOVATECH V5.0 — بروتوكول النشر والربط السحابي

## 1. هيكلة المشروع (Project Architecture)

```
NOVATECH-FOUNDER-HQ/
├── index.html                 ← الجسم الرئيسي للواجهة
├── css/
│   └── style.css              ← نظام التنسيق والبريق الذهبي (Sovereign Design System)
├── scripts/
│   ├── binance-pay-bridge.js   ← ربط رصيد Binance والوضع المحلي/العالمي
│   ├── escrow-intelligence.js  ← الوساطة، العدّاد، عمولة 0.5%، لا صرف دون تأكيد
│   ├── telegram-bot-bridge.js  ← بوت التلغرام (السجل الحي، التنبيهات، القائد)
│   ├── glory-ledger.js         ← سجل المجد + المزامنة السحابية مع Firebase RTDB
│   ├── firebase-bridge.js      ← تهيئة Firebase (Firestore + Realtime Database)
│   ├── legal-vault.js
│   └── cloudflare-bridge.js
├── config/
│   ├── constants.js           ← NOVATECH_CONFIG (botToken, adminChatId, balanceEndpointVercel)
│   └── binance-secret.server.js  ← سري للخادم فقط — لا يظهر في الواجهة
├── api/
│   ├── server-unified.js      ← الخادم الموحد (محلي، Clusters)
│   └── balance.js             ← Serverless Vercel: GET /api/balance (CORS-enabled)
├── vercel.json                ← Rewrites، استثناء config/ scripts/ assets/ css/ api/
├── database.rules.json        ← قواعد أمان Firebase Realtime Database
└── .env.example               ← قالب متغيرات البيئة
```

---

## 2. استضافة السحابة (Deployment)

### GitHub
- إنشاء مستودع **خاص (Private)** على GitHub.
- رفع الكود:
  ```bash
  git init
  git remote add origin https://github.com/YOUR_ORG/NOVATECH-FOUNDER-HQ.git
  git add .
  git commit -m "NOVATECH V5.0 — Sovereign Platform"
  git push -u origin main
  ```
- **لا ترفع:** `.env`, `config/binance-secret.server.js`, مجلد `logs/` (موجود في `.gitignore`).

### Vercel
- ربط المستودع من [vercel.com](https://vercel.com) → **Import Project** → اختر المستودع.
- تفعيل **HTTPS** (افتراضي على Vercel؛ إلزامي لعمل طلبات API من المتصفح إلى Binance).
- إضافة **Environment Variables** في Project → Settings → Environment Variables:
  - `BINANCE_API_KEY` — مفتاح Binance العام
  - `BINANCE_SECRET` — المفتاح السري (لـ `/api/balance` فقط على السيرفر)
  - `TELEGRAM_BOT_TOKEN` — توكن البوت
  - `TELEGRAM_ADMIN_CHAT_ID` — معرف القائد (مثل 1066388294)
- بعد النشر، حدّث في `config/constants.js`:
  - `binance.balanceEndpointVercel`: `https://YOUR_PROJECT.vercel.app/api/balance`

### Namecheap (ربط النطاق)
- في **Domain List** → **Manage** للنطاق:
  - **A Record:** `@` → `76.76.21.21` (عنوان Vercel).
  - **CNAME:** `www` → `cname.vercel-dns.com` (أو النطاق الذي يعطيك إياه Vercel).
- في Vercel: **Project → Settings → Domains** أضف النطاق (مثل `novatech.example.com`).

---

## 3. تكامل Firebase (Firebase Integration)

### Realtime Database
- في [Firebase Console](https://console.firebase.google.com) → المشروع → **Build → Realtime Database** → إنشاء قاعدة (يفضّل منطقة أوروبية).
- نسخ **database URL** ووضعه في `config/constants.js` → `firebase.databaseURL`.

### المسار السيادي
- المسار `sovereign/net_profits` يُستخدم من `glory-ledger.js` لحفظ:
  - `amount` — أرباح الوساطة الصافية
  - `last_update` — وقت آخر تحديث
  - `commander_id` — 1066388294

### قواعد الأمان (Security Rules)
- الملف `database.rules.json` في الجذر.
- **استبدل `COMMANDER_UID`** بمعرف Firebase Auth UID للقائد (بعد تفعيل تسجيل الدخول في المشروع).
- في Firebase Console → Realtime Database → **Rules** الصق القواعد بعد التعديل:
  ```json
  {
    "rules": {
      "sovereign": {
        "net_profits": {
          ".read": "auth !== null && auth.uid === 'YOUR_FIREBASE_UID'",
          ".write": "auth !== null && auth.uid === 'YOUR_FIREBASE_UID'"
        }
      }
    }
  }
  ```
- إذا لم تستخدم Firebase Auth بعد، يمكن مؤقتاً تقييد القراءة/الكتابة بـ `.read` و `.write` حسب الحاجة (انظر وثائق Firebase).

---

## 4. الربط البرمجي (API Configurations)

في `config/constants.js` (أو من مصدر واحد للحقيقة يعرّف `window.NOVATECH_CONFIG`):

| المتغير | الوصف |
|---------|--------|
| `telegram.botToken` | التوكن الكامل للبوت التلغرام |
| `telegram.adminChatId` | معرف القائد (مثل 1066388294) |
| `binance.balanceEndpointVercel` | رابط Serverless لجلب الرصيد: `https://YOUR_VERCEL_PROJECT.vercel.app/api/balance` |

الواجهة تقرأ هذه القيم؛ لا تضع المفتاح السري لـ Binance في الواجهة أبداً.

---

## 5. ميثاق التشغيل (Operational Protocol)

| البند | الحالة البرمجية |
|-------|------------------|
| **الوساطة أولاً — No Release without Confirmation** | مُفعّل في `escrow-intelligence.js`: زر «تسليم المبلغ» غير متاح حتى يتم الضغط على «تأكيد وصول المنتج للعميل». |
| **الأرباح الصافية 0.5%** | نسبة `escrowCommissionRate: 0.005` تُقتطع تلقائياً وتُضاف لخانة «أرباح الوساطة الصافية» (Net Profits). |
| **التنبيهات الحية** | «سيمفونية التقنية» والبريق الذهبي عند كلمات مفتاحية من التلغرام وعند عمولة ≥ 500 USDT؛ إشعار صوتي عند تأكيد وصول المنتج. |

---

© 2026 NOVATECH FOUNDER HOLDINGS LTD. REG: 16945629.
