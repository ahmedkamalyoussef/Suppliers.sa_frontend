# تحليل Endpoints - Postman Collection vs Frontend

## ملخص
هذا الملف يحتوي على تحليل شامل للـ endpoints الموجودة في Postman collection ومقارنتها مع ما يحتاجه الفرونت إند.

---

## ✅ Endpoints المتوافقة مع الفرونت إند

### 1. Authentication (Auth)
جميع endpoints متوافقة:
- ✅ `POST /auth/login` - مستخدم في `app/auth/page.tsx`
- ✅ `POST /auth/send-otp` - مستخدم في `app/auth/page.tsx`
- ✅ `POST /auth/verify-otp` - مستخدم في `app/auth/page.tsx`
- ✅ `POST /auth/forgot-password` - مستخدم في `app/forgot-password/page.tsx`
- ✅ `POST /auth/reset-password` - مستخدم في `app/forgot-password/page.tsx`
- ✅ `POST /auth/logout` - يحتاجه الفرونت
- ✅ `POST /auth/change-password` - يحتاجه الفرونت

### 2. Registration
- ✅ `POST /supplier/register` - مستخدم في `app/auth/page.tsx` و `components/CompleteProfileForm.tsx`

### 3. Supplier Profile
- ✅ `PUT /supplier/profile` - مستخدم في `components/BusinessManagement.tsx`
- ✅ `POST /supplier/profile/image` - مستخدم في `components/BusinessManagement.tsx`
- ✅ `GET /supplier/dashboard` - مستخدم في `app/dashboard/page.tsx`

### 4. Branches
- ✅ `GET /branches` - مستخدم في `components/BranchManagement.tsx`
- ✅ `POST /branches` - مستخدم في `components/BranchManagement.tsx`
- ✅ `PUT /branches/:id` - مستخدم في `components/BranchManagement.tsx`
- ✅ `DELETE /branches/:id` - مستخدم في `components/BranchManagement.tsx`
- ✅ `GET /branches/:id` - يحتاجه الفرونت

### 5. Documents
- ✅ `GET /supplier/documents` - يحتاجه الفرونت
- ✅ `POST /supplier/documents` - مستخدم في `components/CompleteProfileForm.tsx`
- ✅ `DELETE /supplier/documents/:id` - يحتاجه الفرونت
- ✅ `POST /supplier/documents/:id/resubmit` - يحتاجه الفرونت

### 6. Inquiries
- ✅ `GET /supplier/inquiries` - مستخدم في `components/DashboardMessages.tsx`
- ✅ `POST /supplier/inquiries/:id/reply` - مستخدم في `components/DashboardMessages.tsx`
- ✅ `POST /supplier/inquiries/:id/mark-read` - يحتاجه الفرونت
- ✅ `POST /supplier/inquiries/:id/status` - يحتاجه الفرونت

### 7. Public Endpoints
- ✅ `GET /public/businesses` - مستخدم في `app/businesses/page.tsx`
- ✅ `GET /public/businesses/:slug` - مستخدم في `app/business/[id]/BusinessProfile.tsx`
- ✅ `POST /public/businesses/:slug/reviews` - مستخدم في `app/business/[id]/BusinessProfile.tsx`
- ✅ `POST /public/businesses/:slug/inquiries` - مستخدم في `app/business/[id]/BusinessProfile.tsx`
- ✅ `POST /public/reports` - يحتاجه الفرونت

---

## ⚠️ Endpoints غير متوافقة مع الفرونت إند

### 1. Supplier Ratings
**المشكلة:**
- Postman: `POST /supplier/ratings` - يحتاج `ratedSupplierId`, `score`, `comment`
- Frontend: لا يوجد استخدام مباشر لهذا الـ endpoint في الكود الحالي

**التوصية:**
- الفرونت إند يحتاج endpoint للحصول على ratings الخاصة بالـ supplier
- `GET /supplier/ratings` - **ناقص في Postman collection**

### 2. Supplier Reports
**المشكلة:**
- Postman: `GET /supplier/reports?scope=received` - يحتاج query parameter `scope`
- Frontend: لا يوجد استخدام مباشر في الكود

**التوصية:**
- التأكد من أن الـ response structure متوافق مع ما يتوقعه الفرونت

### 3. Dashboard Analytics
**المشكلة:**
- Postman: `GET /supplier/dashboard` - موجود
- Frontend: `app/dashboard/page.tsx` يستخدم mock data

**التوصية:**
- التأكد من أن الـ response structure يحتوي على:
  - Statistics (views, inquiries, ratings)
  - Recent activity
  - Quick actions

---

## ❌ Endpoints الناقصة في Postman Collection

### 1. Supplier Endpoints الناقصة

#### Get Supplier Profile
```
GET /supplier/profile
```
**الاستخدام:** يحتاجه الفرونت في `components/BusinessManagement.tsx` لجلب بيانات الـ supplier

**Response Structure:**
```json
{
  "id": 1,
  "businessName": "Metro Electronics",
  "businessType": "Supplier",
  "categories": ["Electronics", "Technology"],
  "services": ["Wholesale", "Repair"],
  "description": "We provide electronics.",
  "website": "https://metroelectronics.com",
  "address": "Riyadh",
  "serviceDistance": 40,
  "contactPhone": "+966500000001",
  "contactEmail": "contact@metroelectronics.com",
  "profileImage": "url",
  "status": "active",
  "verificationStatus": "pending_verification"
}
```

#### Get Supplier Ratings (Received)
```
GET /supplier/ratings
```
**الاستخدام:** يحتاجه الفرونت لعرض التقييمات التي استلمها الـ supplier

**Query Parameters:**
- `scope` (optional): "received" | "given"
- `page` (optional): number
- `per_page` (optional): number

**Response Structure:**
```json
{
  "data": [
    {
      "id": 1,
      "ratedBy": {
        "id": 2,
        "name": "Customer Name",
        "businessName": "Customer Business"
      },
      "score": 5,
      "comment": "Excellent service",
      "createdAt": "2024-01-20T10:00:00Z",
      "status": "approved"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 10,
    "per_page": 15
  }
}
```

#### Get Supplier Dashboard Analytics
```
GET /supplier/dashboard/analytics
```
**الاستخدام:** يحتاجه الفرونت في `components/DashboardAnalytics.tsx`

**Query Parameters:**
- `range` (optional): "7" | "30" | "90" | "365" (days)

**Response Structure:**
```json
{
  "views": {
    "total": 1250,
    "thisMonth": 320,
    "change": 15.5
  },
  "inquiries": {
    "total": 45,
    "thisMonth": 12,
    "change": -5.2
  },
  "ratings": {
    "average": 4.8,
    "total": 120,
    "thisMonth": 15
  },
  "revenue": {
    "total": 50000,
    "thisMonth": 12000
  }
}
```

### 2. Public Endpoints الناقصة

#### Search Businesses
```
GET /public/businesses
```
**الاستخدام:** مستخدم في `app/businesses/page.tsx` و `components/SearchSection.tsx`

**Query Parameters المطلوبة:**
- `keyword` (optional): string - للبحث
- `category` (optional): string - تصفية حسب الفئة
- `location` (optional): string - تصفية حسب الموقع
- `page` (optional): number
- `per_page` (optional): number
- `sort` (optional): "relevance" | "rating" | "newest"

**ملاحظة:** الـ endpoint موجود لكن يحتاج query parameters إضافية

### 3. Admin Endpoints الناقصة

#### Get Admin Profile
```
GET /admin/profile
```
**الاستخدام:** يحتاجه الفرونت في `app/admin/page.tsx`

**Response Structure:**
```json
{
  "id": 1,
  "name": "Admin Name",
  "email": "admin@example.com",
  "role": "admin" | "super_admin",
  "department": "IT",
  "job_role": "Manager",
  "permissions": {
    "user_management_view": true,
    "user_management_edit": false,
    // ... other permissions
  },
  "profileImage": "url"
}
```

#### Get Admin Dashboard Analytics
```
GET /admin/dashboard/analytics
```
**الاستخدام:** يحتاجه الفرونت في `components/AdminAnalytics.tsx`

**Query Parameters:**
- `range` (optional): "7" | "30" | "90" | "365"

**Response Structure:**
```json
{
  "users": {
    "total": 1000,
    "active": 850,
    "newThisMonth": 50
  },
  "businesses": {
    "total": 500,
    "verified": 450,
    "pending": 30
  },
  "reviews": {
    "total": 5000,
    "pending": 25,
    "approved": 4800
  },
  "revenue": {
    "total": 100000,
    "thisMonth": 15000
  }
}
```

---

## 🔄 Endpoints تحتاج تعديل في Backend

### 1. Supplier Profile Update
**المشكلة:**
- Postman: `PUT /supplier/profile` - يرسل كل الحقول
- Frontend: `components/BusinessManagement.tsx` يحتاج إرسال partial updates

**التوصية:**
- Backend يجب أن يقبل partial updates (PATCH بدلاً من PUT)
- أو استخدام `PATCH /supplier/profile` للـ partial updates

### 2. Branch Update
**المشكلة:**
- Postman: `PUT /branches/:id` - يرسل كل الحقول
- Frontend: `components/BranchManagement.tsx` قد يحتاج partial updates

**التوصية:**
- إضافة `PATCH /branches/:id` للـ partial updates

### 3. Inquiry Reply
**المشكلة:**
- Postman: `POST /supplier/inquiries/:id/reply` - يرسل `message` فقط
- Frontend: `components/DashboardMessages.tsx` قد يحتاج إرسال `subject` أيضاً

**التوصية:**
- التأكد من أن الـ endpoint يقبل `subject` (optional) في الـ request body

---

## 📋 ملخص التوصيات

### Endpoints يجب إضافتها:
1. ✅ `GET /supplier/profile` - للحصول على بيانات الـ supplier
2. ✅ `GET /supplier/ratings` - للحصول على التقييمات
3. ✅ `GET /supplier/dashboard/analytics` - للإحصائيات
4. ✅ `GET /admin/profile` - للحصول على بيانات الـ admin
5. ✅ `GET /admin/dashboard/analytics` - لإحصائيات الـ admin

### Endpoints تحتاج تعديل:
1. ⚠️ `PUT /supplier/profile` → إضافة `PATCH /supplier/profile` للـ partial updates
2. ⚠️ `PUT /branches/:id` → إضافة `PATCH /branches/:id` للـ partial updates
3. ⚠️ `POST /supplier/inquiries/:id/reply` → إضافة `subject` (optional) في الـ request

### Query Parameters يجب إضافتها:
1. ⚠️ `GET /public/businesses` → إضافة query parameters للبحث والتصفية
2. ⚠️ `GET /supplier/ratings` → إضافة query parameters للتصفية والـ pagination

---

## 📝 ملاحظات إضافية

1. **Authentication Token:**
   - جميع الـ endpoints المحمية تحتاج `Authorization: Bearer {token}` header
   - الفرونت إند يستخدم `localStorage` لتخزين الـ token

2. **Error Handling:**
   - جميع الـ endpoints يجب أن ترجع errors بنفس الـ structure:
   ```json
   {
     "message": "Error message",
     "errors": {
       "field": ["Error for field"]
     }
   }
   ```

3. **Pagination:**
   - جميع الـ list endpoints يجب أن تدعم pagination:
   ```json
   {
     "data": [...],
     "meta": {
       "current_page": 1,
       "per_page": 15,
       "total": 100,
       "last_page": 7
     }
   }
   ```

4. **File Uploads:**
   - الـ endpoints التي تقبل ملفات يجب أن تستخدم `multipart/form-data`
   - Max file size: 5MB (كما هو محدد في الفرونت)

---

## 🎯 الأولوية

### عالية الأولوية (يجب إضافتها فوراً):
1. `GET /supplier/profile`
2. `GET /supplier/dashboard/analytics`
3. `GET /admin/profile`
4. `GET /admin/dashboard/analytics`

### متوسطة الأولوية:
1. `GET /supplier/ratings`
2. Query parameters للبحث والتصفية
3. `PATCH` endpoints للـ partial updates

### منخفضة الأولوية:
1. تحسينات على error handling
2. تحسينات على pagination structure

