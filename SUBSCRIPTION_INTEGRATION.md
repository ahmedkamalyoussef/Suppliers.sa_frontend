# 🚀 نظام الاشتراكات - دليل التكامل مع Next.js

تم إنشاء نظام اشتراكات متكامل جاهز للاستخدام في مشروع Supplier.sa1

## 📁 الملفات التي تم إنشاؤها

### 🔧 API Layer

- `lib/subscription-api.js` - كلاس للتعامل مع API endpoints
- `hooks/useSubscription.js` - Hook للتحقق من حالة الاشتراك

### 🎨 Components

- `components/SubscriptionPlans.jsx` - عرض الباقات مع الدفع
- `components/SubscriptionStatus.jsx` - عرض حالة الاشتراك الحالي
- `pages/subscription.js` - صفحة الاشتراكات الرئيسية
- `pages/payment/success.js` - صفحة نجاح الدفع

## 🚀 طريقة الاستخدام

### 1. **إعداد المتغيرات البيئية**

```bash
cp .env.local.example .env.local
```

أضف في ملف `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_TAP_PUBLISHABLE_KEY=pk_test_EtHFV4kGnW5b1GQx9z2DHFVJ
```

### 2. **عرض الباقات في أي صفحة**

```jsx
import SubscriptionPlans from "../components/SubscriptionPlans";

export default function MyPage() {
  return <SubscriptionPlans />;
}
```

### 3. **التحقق من حالة الاشتراك**

```jsx
import { useSubscription } from "../hooks/useSubscription";

export default function Dashboard() {
  const { isPremium, subscription, loading } = useSubscription();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isPremium ? (
        <div>Welcome Premium User!</div>
      ) : (
        <div>Please upgrade to Premium</div>
      )}
    </div>
  );
}
```

### 4. **عرض حالة الاشتراك**

```jsx
import SubscriptionStatus from "../components/SubscriptionStatus";

export default function ProfilePage() {
  return (
    <div>
      <h1>My Profile</h1>
      <SubscriptionStatus />
    </div>
  );
}
```

## 🎯 نقاط API المتاحة

### للمستخدمين

```javascript
// عرض الباقات
GET /api/tap/subscription/plans

// إنشاء دفع اشتراك
POST /api/tap/subscription/payment
{
  "plan_id": 2,
  "customer": {
    "first_name": "أحمد",
    "last_name": "محمد",
    "email": "user@example.com",
    "phone": {
      "country_code": "966",
      "number": "512345678"
    }
  }
}

// الاشتراك الحالي
GET /api/tap/subscription/current

// سجل الاشتراكات
GET /api/tap/subscription/history

// التحقق من الدفع الناجح
GET /api/tap/subscription/success?tap_id=xxx
```

## 🌍 دعم اللغات

النظام يدعم العربية والإنجليزية بالكامل:

### الباقات في الداتابيز

```json
{
  "features": {
    "en": ["Basic business profile listing", "Contact information display"],
    "ar": ["إدراج ملف نشاط تجاري أساسي", "عرض معلومات التواصل"]
  }
}
```

### في الكومبوننتس

```jsx
const { i18n } = useTranslation();
const features = getLocalizedFeatures(plan.features); // بترجع اللغة المناسبة
```

## 💾 البيانات من الداتابيز

الـ API بيرجع الباقات كالتالي:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "basic",
      "display_name": "Basic",
      "description": "Perfect for businesses just getting started",
      "price": "0.00",
      "currency": "SAR",
      "billing_cycle": "monthly",
      "duration_months": 1,
      "features": {
        "en": ["Basic business profile listing", "Contact information display"],
        "ar": ["إدراج ملف نشاط تجاري أساسي", "عرض معلومات التواصل"]
      },
      "formatted_price": "0.00 SAR",
      "duration_text": "شهري",
      "is_active": true
    },
    {
      "id": 2,
      "name": "premium_monthly",
      "display_name": "Premium Business",
      "description": "Complete solution for serious business growth",
      "price": "199.00",
      "currency": "SAR",
      "billing_cycle": "monthly",
      "duration_months": 1,
      "features": {
        "en": [
          "Everything in Free, plus:",
          "📍 Pin and manage multiple locations"
        ],
        "ar": [
          "كل ما في المجاني، بالإضافة إلى:",
          "📍 تثبيت وإدارة مواقع متعددة"
        ]
      },
      "formatted_price": "199.00 SAR",
      "duration_text": "شهري",
      "is_active": true
    },
    {
      "id": 3,
      "name": "premium_yearly",
      "display_name": "Premium Business",
      "description": "Complete solution for serious business growth - Save 25%",
      "price": "1799.00",
      "currency": "SAR",
      "billing_cycle": "yearly",
      "duration_months": 12,
      "features": {
        "en": [
          "Everything in Monthly Premium, plus:",
          "💰 Save $589 (25% off)"
        ],
        "ar": [
          "كل ما في الباقة الشهرية، بالإضافة إلى:",
          "💰 وفّر $589 (خصم 25%)"
        ]
      },
      "formatted_price": "1799.00 SAR",
      "duration_text": "سنوي",
      "is_active": true
    }
  ]
}
```

## 🔄 تدفق الدفع

1. **المستخدم يختار باقة** → `POST /api/tap/subscription/payment`
2. **يتم إنشاء transaction** في الداتابيز بحالة `pending`
3. **يتم توجيهه لـ Tap** للدفع
4. **بعد الدفع الناجح** → Tap ترسل webhook
5. **يتم تفعيل الاشتراك** تلقائياً
6. **يتم إرجاع المستخدم** لصفحة النجاح

## 🛡️ حماية الميزات

يمكنك حماية الميزات المتقدمة باستخدام middleware في Laravel:

```php
// في routes/api.php
Route::middleware(['auth:sanctum', 'subscription:premium'])->group(function () {
    Route::get('/premium-features', [PremiumController::class, 'index']);
});
```

## 🎨 التصميم

- **Responsive**: يعمل على جميع الأجهزة
- **Modern Design**: باستخدام Tailwind CSS
- **Animations**: انتقالات سلسة وحركات جذابة
- **Localization**: دعم كامل للعربية والإنجليزية
- **Status Indicators**: عرض واضح لحالة الاشتراك

## 📱 أمثلة الاستخدام

### في Dashboard

```jsx
import SubscriptionStatus from "../components/SubscriptionStatus";

export default function Dashboard() {
  return (
    <div>
      <SubscriptionStatus />
      {/* باقي محتوى الداشبورد */}
    </div>
  );
}
```

### في Pricing Page

```jsx
import SubscriptionPlans from "../components/SubscriptionPlans";

export default function Pricing() {
  return (
    <div>
      <h1>Choose Your Plan</h1>
      <SubscriptionPlans />
    </div>
  );
}
```

## 🔧 الخطوات التالية

1. **أضف الملفات لمشروعك**
2. **إعد متغيرات البيئة**
3. **اختبر الدفع باستخدام مفاتيح الاختبار**
4. **ربط مع نظام المستخدمين لديك**
5. **خصص التصميم حسب هوية علامتك**

النظام جاهز للاستخدام الفوري! 🚀
