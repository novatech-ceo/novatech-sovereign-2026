# النواة السيادية — NOVATECH FOUNDER HOLDINGS LTD

هذا المجلد هو **القاعدة (Base)** لجميع ملفات المشروع القادمة. المصدر الأول للكود: Gemini (المهندس المعماري والمدير التنفيذي). الوكيل التقني: Cursor Agent.

## الثوابت التي لا تُمس

- **رقم التسجيل (REG):** 16945629  
- **الحسابات المالية السيادية** الواردة في `config/constants.js` وفي واجهة **تدفق السيولة العالمية** — لا تعديل إلا بأمر مباشر.

## هيكل المشروع النهائي (V5.0) — مرجع التطوير المستقبلي

```
D:\NOVATECH-FOUNDER-HQ\
├── index.html              ← الواجهة الرئيسية (الدستور الرقمي)
├── BASE.md                 ← هذا الملف — مرجع القاعدة والهيكل
├── DEPLOYMENT.md           ← بروتوكول النشر: GitHub، Vercel، Namecheap، Firebase، ميثاق التشغيل
├── START_EMPIRE.bat        ← تشغيل الخادم الموحد بضغطة واحدة (ينظّف 3080 ثم node server-unified.js)
├── vercel.json             ← إعدادات النشر والـ rewrites (config/ scripts/ assets/ css/ api/)
├── database.rules.json     ← قواعد أمان Firebase Realtime Database (sovereign/net_profits)
├── .env.example            ← قالب متغيرات البيئة (لا ترفع .env)
├── .gitignore
│
├── css/
│   └── style.css           ← نظام التنسيق والبريق الذهبي (Sovereign Design System)
│
├── api/                    ← مركز العمليات الخلفي (API Core)
│   ├── server-unified.js   ← الخادم الموحد: API + الواجهة + هوني بوت (المُشغّل من START_EMPIRE)
│   ├── balance.js          ← Serverless Vercel: GET /api/balance (CORS، رصيد Binance)
│   └── server-binance-balance.js   ← خادم رصيد فقط (بديل عند الحاجة)
│
├── config/
│   ├── constants.js        ← الثوابت القانونية + NOVATECH_CONFIG (botToken, adminChatId, balanceEndpointVercel)
│   └── binance-secret.server.js     ← سري للخادم فقط — لا يُضمّن في الواجهة أبداً
│
├── scripts/
│   ├── firebase-bridge.js  ← Firestore + Realtime Database (window.db لـ glory-ledger)
│   ├── telegram-bot-bridge.js
│   ├── binance-pay-bridge.js
│   ├── cloudflare-bridge.js
│   ├── legal-vault.js
│   ├── escrow-intelligence.js
│   ├── glory-ledger.js     ← سجل المجد + المزامنة السحابية sovereign/net_profits
│   └── server-binance-balance.js    ← نسخة قديمة؛ التشغيل المعتمد من api/
│
└── assets/
```

## التكامل

| المكون        | الحالة        | الملاحظة |
|---------------|---------------|----------|
| Firebase      | هيكل جاهز    | تفعيل عند إضافة `apiKey` في `NOVATECH_CONFIG.firebase` |
| Telegram Bot  | **مفعّل**    | عند فتح index.html يُرسل "System Online" إلى `adminChatId`. السجل يعرض تفاعلات البوت. في `config/constants.js`: ضع `botToken` (كامل) و`adminChatId` (رقم الدردشة). |
| Binance Pay   | **مفعّل**    | رصيد Spot من endpoint آمن (الـ Secret في الخادم فقط). التشغيل: **START_EMPIRE.bat** أو `cd api && node server-binance-balance.js`. الرابط: `http://localhost:3080/api/balance`. عند نجاح الـ Fetch: كارت Binance ينبض نبضاً أخضر ساطعاً لثانية واحدة. **وضع السفر:** تبديل الربط من محلي إلى عالمي (Vercel) عبر زر في الواجهة — تعيين `binance.balanceEndpointVercel` في constants.js لرابط Vercel المستقبلي. |
| Cloudflare    | رابط لوحة + جسر | استدعاءات API عبر بروكسي خلفية |

## التوسع الوظيفي

| المكون | الوصف |
|--------|--------|
| **جسر الهوية القانونية** | زر مخفي (درع ذهبي، ركن يسار أسفل). يفتح بكلمة مرور فقط؛ يعرض المستندات السيادية (جواز، شهادة تأسيس UK، رخصة قيادة دولية). كلمة المرور الافتراضية: `NOVATECH2026` أو من `NOVATECH_CONFIG.vaultPassword`. |
| **مركز الوساطة والضمان** | عداد تنازلي لكل عملية؛ «تسليم المبلغ» غير متاح حتى «تأكيد وصول المنتج للعميل». |
| **أرباح الوساطة الصافية** | عمولة (0.5% افتراضي) تُقتطع من كل عملية عند التسليم وتُعرض في خانة «أرباح الوساطة الصافية». |

## النشر على Vercel

- المشروع جاهز للنشر كموقع ثابت. المفاتيح السرية تبقى **خارج الواجهة**:
  - في Vercel: **Project → Settings → Environment Variables** أضف `BINANCE_SECRET`, `TELEGRAM_BOT_TOKEN`, `VAULT_PASSWORD` وغيرها (انظر `.env.example`).
  - لا تضف ملف `config/binance-secret.server.js` أو `.env` إلى مستودع عام؛ استخدم متغيرات البيئة في Vercel للخادم (Serverless) إن أضفت API لاحقاً.

## التجميع النهائي (النظام الموحد 100%)

| الركن | الحالة |
|--------|--------|
| **الموثوقية المالية** | API Key في constants.js، Secret في api/server-binance-balance.js فقط. النبض الأخضر عند كل جلب ناجح؛ وضع المحاكاة الذهبي فوراً عند الانقطاع. |
| **الحصن القانوني** | زر الدرع الذهبي يطلب NOVATECH2026؛ المستندات (الجواز، REG 16945629) بتنسيق زجاجي ملكي. أي محاولة خاطئة → إنذار أحمر فوري للبوت 8288631881. |
| **الوساطة والأرباح** | لا تسليم مبلغ إلا بعد تأكيد وصول المنتج؛ عدادات تنازلية؛ عمولة 0.5% → أرباح الوساطة الصافية؛ توهج ذهبي عند >1000 USDT. |
| **الذكاء التفاعلي** | سجل العمليات مربوط بالبوت؛ كلمات (ربح، شراء، فوز، ايداع) → وميض ذهبي + سيمفونية تقنية؛ رسائل القائد (ID 1066388294) بلون ملكي. |
| **هندسة التشغيل** | START_EMPIRE.bat ينظّف المنفذ 3080 قبل التشغيل؛ جاهز لـ Vercel مع المفاتيح في Environment Variables؛ شريط علوي: توقيت لندن، حالة الربط، تدمير الجلسة (كلمة مرور). |

## بروتوكول ساعة الصفر (The Final Deployment)

- **كيان واحد:** الخادم الموحد **api/server-unified.js** يخدم من منفذ واحد (3080):
  - **GET /api/balance** — رصيد Binance (المفتاح السري من config أو env فقط).
  - **الواجهة والملفات الثابتة** — `/`, `/index.html`, `/config/*`, `/scripts/*`, `/assets/*`.
  - **بروتوكول التمويه (Honeypot):** طلبات إلى `/api/internal/admin` أو `/api/login` تُسجَّل ويُرسل إنذار إلى البوت (إن وُجدت TELEGRAM_BOT_TOKEN و TELEGRAM_ADMIN_CHAT_ID في البيئة)، مع إرجاع 404.
- **النشر الموزع (Distributed Hosting):** تشغيل نفس الخادم على أكثر من سيرفر أو منطقة (مثلاً نسخة محلية + نسخة على Vercel/Cloudflare) يزيد التوفر؛ تعيين **balanceEndpoint** و **balanceEndpointVercel** حسب البيئة.
- **عرش الماتريكس:** واجهة «خارطة السيطرة العالمية» (نقاط ضوئية تمثيلية) و«سجل المجد — مجد جيمي وكاظم» يوثّق كل عمولة وساطة بلون ذهبي؛ المبالغ الكبيرة (≥500 USDT) تُطلق سيمفونية نصر.

## بروتوكول التدشين (Inauguration Protocol)

- **اختبار الجسر الحي:** عند نجاح Fetch من `http://localhost:3080/api/balance` يُضيء كارت Binance بـ «نبض أخضر ساطع» لثانية واحدة.
- **وضع السفر (Global Access):** في الواجهة — «وضع السفر (الربط): محلي | عالمي (Vercel)»؛ ضبط `binance.balanceEndpointVercel` في config لرابط Vercel ثم اختيار «عالمي» للعمل من أي مكان.
- **رسالة الختام الملكية:** عند أول تشغيل بعد التحديث يُرسل للبوت مرة واحدة: «👑 سيادة القائد، إمبراطورية NOVATECH الرقمية تحت أمرك الآن. جميع الأنظمة (مالية، قانونية، وساطة) تعمل بكفاءة 100%.» (يتطلب تعبئة `adminChatId`).

## الهوية البصرية

الذهب والماتريكس (Orbitron + Cairo، ألوان `--gold`, `--neon-green`, `--neon-blue`, `--void-black`) ثابتة في كل توسعات المشروع.

---

© 2026 NOVATECH FOUNDER HOLDINGS LTD. DRAGON ENGINE SECURITY.
