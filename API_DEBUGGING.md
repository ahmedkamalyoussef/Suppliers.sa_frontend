# API Debugging Guide

## التحقق من أن API يعمل

### 1. تحقق من Base URL
افتح `lib/api/config.ts` وتأكد من:
```typescript
baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"
```

### 2. تحقق من Console
افتح Developer Tools (F12) واذهب لـ Console. عند عمل API call، ستجد:
- Request URL
- Request Headers
- Response Data
- أي أخطاء

### 3. تحقق من Network Tab
في Developer Tools > Network:
- ابحث عن requests للـ `/api/auth/login` أو `/api/supplier/register`
- تحقق من:
  - Status Code (200 = نجح، 400/401/500 = خطأ)
  - Request Payload (البيانات المرسلة)
  - Response (البيانات المستقبلة)

### 4. اختبار Registration
1. اذهب لـ `/auth`
2. اختر Sign Up
3. املأ البيانات:
   - Business Name
   - Phone
   - Email
   - Password
4. اضغط Submit
5. تحقق من Console و Network Tab

### 5. اختبار Login
1. اذهب لـ `/auth`
2. اختر Sign In
3. املأ Email و Password
4. اضغط Submit
5. تحقق من Console

## مشاكل شائعة

### Error: Network Error
- تأكد أن الباك إند شغال على `http://localhost:8000`
- تحقق من CORS settings في الباك إند

### Error: 401 Unauthorized
- الـ token منتهي أو غير صحيح
- تحقق من localStorage: `auth_token`

### Error: 400 Bad Request
- البيانات المرسلة غير صحيحة
- تحقق من Request Payload في Network Tab
- تحقق من validation في الباك إند

### Response Structure مختلف
الكود يدعم عدة response structures:
- `{ success: true, data: { token: "..." } }`
- `{ token: "..." }`
- `{ data: { token: "..." } }`

## إضافة Logging

لإضافة logging مؤقت، أضف في أي API call:
```typescript
console.log("API Request:", endpoint, data);
const response = await api.post(endpoint, data);
console.log("API Response:", response);
```

