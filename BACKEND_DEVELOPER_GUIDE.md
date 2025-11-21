# دليل المطور - Backend API Implementation

## 📋 نظرة عامة

هذا الدليل موجه لمطور الباك إند لتنفيذ الـ API endpoints المطلوبة للربط مع الفرونت إند.

---

## 🎯 الملفات المرجعية

### 1. الملف الرئيسي (ابدأ من هنا)
**`BACKEND_API_SPECIFICATION.md`**
- يحتوي على المواصفات الكاملة لجميع الـ endpoints
- Request/Response structure لكل endpoint
- أمثلة كاملة

### 2. ملف الربط
**`FRONTEND_ENDPOINTS_MAPPING.md`**
- يوضح ربط كل functionality في الفرونت بالـ endpoints
- يساعدك في فهم الاستخدام

### 3. ملف التحليل
**`API_ENDPOINTS_ANALYSIS.md`**
- التحليل الأولي والمقارنة

---

## ✅ Checklist للتنفيذ

### المرحلة 1: Endpoints الناقصة (عالية الأولوية)

#### Supplier Endpoints
- [ ] `GET /supplier/profile`
  - جلب بيانات الـ supplier الكاملة
  - Response structure موجود في `BACKEND_API_SPECIFICATION.md` (القسم 1.1)
  
- [ ] `GET /supplier/ratings`
  - جلب التقييمات التي استلمها الـ supplier
  - Query parameters: `scope`, `page`, `per_page`, `status`
  - Response structure موجود في `BACKEND_API_SPECIFICATION.md` (القسم 1.2)
  
- [ ] `GET /supplier/dashboard/analytics`
  - جلب إحصائيات متقدمة للـ dashboard
  - Query parameter: `range` (7|30|90 days)
  - Response structure موجود في `BACKEND_API_SPECIFICATION.md` (القسم 1.3)

#### Admin Endpoints
- [ ] `GET /admin/profile`
  - جلب بيانات الـ admin
  - Response structure موجود في `BACKEND_API_SPECIFICATION.md` (القسم 2.1)
  
- [ ] `GET /admin/dashboard/analytics`
  - جلب إحصائيات متقدمة للـ admin dashboard
  - Query parameter: `range` (7|30|90|365 days)
  - Response structure موجود في `BACKEND_API_SPECIFICATION.md` (القسم 2.2)

#### Public Endpoints
- [ ] `GET /public/businesses/:slug/reviews`
  - جلب التقييمات المعتمدة لـ business معين
  - Query parameters: `page`, `per_page`, `sort`
  - Response structure موجود في `BACKEND_API_SPECIFICATION.md` (القسم 3.2)

---

### المرحلة 2: تعديل Endpoints موجودة

- [ ] `POST /supplier/inquiries/:id/reply`
  - **التعديل:** إضافة `subject` (optional) في الـ request body
  - Request body:
    ```json
    {
      "message": "Thanks for reaching out...",
      "subject": "Re: Your Inquiry" // optional
    }
    ```

- [ ] `PUT /supplier/profile`
  - **التعديل:** إضافة `PATCH /supplier/profile` للـ partial updates
  - أو تعديل `PUT` ليقبل partial updates
  - Request body يمكن أن يحتوي على أي حقل أو مجموعة حقول

- [ ] `PUT /branches/:id`
  - **التعديل:** إضافة `PATCH /branches/:id` للـ partial updates
  - أو تعديل `PUT` ليقبل partial updates

---

### المرحلة 3: تحسين Query Parameters

- [ ] `GET /public/businesses`
  - إضافة query parameters:
    - `keyword` (string) - للبحث
    - `category` (string) - تصفية حسب الفئة
    - `location` (string) - تصفية حسب الموقع
    - `businessType` (string) - نوع الـ business
    - `minRating` (number) - الحد الأدنى للتقييم
    - `serviceDistance` (number) - المسافة
    - `targetCustomer` (string) - نوع العملاء
    - `page` (number) - للـ pagination
    - `per_page` (number) - عدد النتائج
    - `sort` (string) - طريقة الترتيب

- [ ] `GET /supplier/ratings`
  - إضافة query parameters:
    - `scope` (received|given)
    - `page` (number)
    - `per_page` (number)
    - `status` (approved|pending_review|rejected)

---

## 📐 معايير التنفيذ

### 1. Response Structure

جميع الـ responses يجب أن تتبع هذا الـ structure:

**Success Response:**
```json
{
  "data": {...}, // أو array [...]
  "meta": {...}, // للـ pagination
  "message": "..." // optional
}
```

**Error Response:**
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Error for field"]
  }
}
```

### 2. Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### 3. Pagination

جميع الـ list endpoints يجب أن تدعم pagination:

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7,
    "from": 1,
    "to": 15
  }
}
```

### 4. Date Formats

- جميع التواريخ في format: `ISO 8601` (e.g., `2024-01-20T10:00:00Z`)
- الـ dates في query parameters: `YYYY-MM-DD`

### 5. Time Formats

- الـ working hours في format: `HH:mm` (e.g., `09:00`, `17:00`)

### 6. File Uploads

- Content-Type: `multipart/form-data`
- Max file size: 5MB
- Allowed types: JPG, PNG, PDF

---

## 🔍 اختبار الـ Endpoints

بعد تنفيذ كل endpoint، يجب اختباره مع:

1. **Postman Collection** - للتأكد من التوافق
2. **Frontend** - للتأكد من أن الـ response structure متوافق

---

## 📞 ملاحظات مهمة

1. **الأولوية للفرونت:** جميع الـ endpoints المطلوبة في الفرونت موجودة في التوثيق
2. **لا تحذف:** جميع الـ endpoints في Postman collection مطلوبة
3. **التوافق:** يجب أن تكون الـ response structure مطابقة تماماً لما في التوثيق
4. **الاختبار:** بعد كل endpoint، اختبره مع الفرونت إند

---

## 🚀 خطة التنفيذ المقترحة

### الأسبوع الأول
1. إضافة `GET /supplier/profile`
2. إضافة `GET /supplier/ratings`
3. إضافة `GET /supplier/dashboard/analytics`

### الأسبوع الثاني
1. إضافة `GET /admin/profile`
2. إضافة `GET /admin/dashboard/analytics`
3. إضافة `GET /public/businesses/:slug/reviews`

### الأسبوع الثالث
1. تعديل `POST /supplier/inquiries/:id/reply`
2. إضافة `PATCH /supplier/profile`
3. إضافة `PATCH /branches/:id`

### الأسبوع الرابع
1. تحسين query parameters لـ `GET /public/businesses`
2. تحسين query parameters لـ `GET /supplier/ratings`
3. Testing & Bug fixes

---

**تاريخ الإنشاء:** 2024-01-20  
**الإصدار:** 1.0

