# Frontend to Backend Endpoints Mapping

## 📋 ملخص
هذا الملف يوضح ربط كل functionality في الفرونت إند بالـ endpoints المطلوبة في الباك إند.

---

## 🔐 Authentication & Registration

### 1. Login Page (`app/auth/page.tsx`)
**Functionality:** تسجيل الدخول
- ✅ `POST /auth/login` - موجود في Postman
- **Request:** `{ email, password }`
- **Response:** `{ token, user }`

### 2. Registration (`app/auth/page.tsx`, `components/CompleteProfileForm.tsx`)
**Functionality:** تسجيل supplier جديد
- ✅ `POST /supplier/register` - موجود في Postman
- **Request:** `{ businessName, email, phone, password, password_confirmation }`
- **Response:** `{ id, businessName, email, status }`

### 3. OTP Verification (`app/auth/page.tsx`)
**Functionality:** التحقق من OTP
- ✅ `POST /auth/send-otp` - موجود في Postman
- ✅ `POST /auth/verify-otp` - موجود في Postman
- **Request:** `{ email, otp }`
- **Response:** `{ verified: true }`

### 4. Forgot Password (`app/forgot-password/page.tsx`)
**Functionality:** نسيان كلمة المرور
- ✅ `POST /auth/forgot-password` - موجود في Postman
- ✅ `POST /auth/reset-password` - موجود في Postman
- **Request:** `{ email, otp, password, password_confirmation }`
- **Response:** `{ message }`

### 5. Change Password (`components/DashboardSettings.tsx`)
**Functionality:** تغيير كلمة المرور
- ✅ `POST /auth/change-password` - موجود في Postman
- **Request:** `{ current_password, password, password_confirmation }`
- **Response:** `{ message }`

### 6. Logout (جميع الصفحات)
**Functionality:** تسجيل الخروج
- ✅ `POST /auth/logout` - موجود في Postman
- **Response:** `{ message }`

---

## 👤 Supplier Dashboard

### 1. Dashboard Overview (`app/dashboard/page.tsx`, `components/DashboardStats.tsx`)
**Functionality:** عرض إحصائيات الـ dashboard
- ✅ `GET /supplier/dashboard` - موجود في Postman
- ❌ `GET /supplier/dashboard/analytics` - **ناقص** (يحتاج إضافة)
- **Response المطلوبة:**
  ```json
  {
    "stats": {
      "views": {"current": 1247, "change": 12.5, "trend": "up"},
      "contacts": {"current": 89, "change": 8.2, "trend": "up"},
      "inquiries": {"current": 34, "change": -3.1, "trend": "down"},
      "rating": {"current": 4.8, "change": 0.2, "trend": "up"}
    },
    "recentActivities": [...],
    "quickActions": [...]
  }
  ```

### 2. Dashboard Analytics (`components/DashboardAnalytics.tsx`)
**Functionality:** عرض تحليلات متقدمة
- ❌ `GET /supplier/dashboard/analytics` - **ناقص** (يحتاج إضافة)
- **Query Parameters:** `range` (7|30|90 days)
- **Response المطلوبة:**
  ```json
  {
    "views": {"total": 1250, "thisMonth": 320, "change": 15.5, "chartData": [...]},
    "contacts": {...},
    "inquiries": {...},
    "ratings": {"average": 4.8, "total": 120, "thisMonth": 15},
    "topSearchKeywords": [...],
    "customerInsights": {...}
  }
  ```

### 3. Business Management (`components/BusinessManagement.tsx`)
**Functionality:** إدارة بيانات الـ business
- ❌ `GET /supplier/profile` - **ناقص** (يحتاج إضافة)
- ✅ `PUT /supplier/profile` - موجود في Postman
- ✅ `POST /supplier/profile/image` - موجود في Postman
- **Request (PUT):** `{ businessName, businessType, categories, services, description, ... }`
- **Response:** `{ id, businessName, ... }`

### 4. Branch Management (`components/BranchManagement.tsx`)
**Functionality:** إدارة الفروع
- ✅ `GET /branches` - موجود في Postman
- ✅ `POST /branches` - موجود في Postman
- ✅ `PUT /branches/:id` - موجود في Postman
- ✅ `DELETE /branches/:id` - موجود في Postman
- ✅ `GET /branches/:id` - موجود في Postman
- **Request (POST):** `{ name, phone, email, address, manager, location, workingHours, ... }`
- **Response:** `{ id, name, ... }`

### 5. Documents Management (`components/CompleteProfileForm.tsx`)
**Functionality:** إدارة المستندات
- ✅ `GET /supplier/documents` - موجود في Postman
- ✅ `POST /supplier/documents` - موجود في Postman
- ✅ `DELETE /supplier/documents/:id` - موجود في Postman
- ✅ `POST /supplier/documents/:id/resubmit` - موجود في Postman
- **Request (POST):** FormData مع `documentType, referenceNumber, issueDate, expiryDate, notes, document`
- **Response:** `{ id, documentType, status }`

### 6. Messages/Inquiries (`components/DashboardMessages.tsx`)
**Functionality:** إدارة الاستفسارات
- ✅ `GET /supplier/inquiries` - موجود في Postman
- ✅ `POST /supplier/inquiries/:id/reply` - موجود في Postman
- ✅ `POST /supplier/inquiries/:id/mark-read` - موجود في Postman
- ✅ `POST /supplier/inquiries/:id/status` - موجود في Postman
- **Request (Reply):** `{ message, subject? }` - **يحتاج إضافة `subject` (optional)**
- **Response:** `{ id, status, repliedAt }`

### 7. Ratings (`components/DashboardStats.tsx`, `app/profile/[id]/PublicBusinessProfile.tsx`)
**Functionality:** عرض التقييمات
- ❌ `GET /supplier/ratings` - **ناقص** (يحتاج إضافة)
- ✅ `POST /supplier/ratings` - موجود في Postman (لتقييم supplier آخر)
- **Query Parameters:** `scope` (received|given), `page`, `per_page`, `status`
- **Response المطلوبة:**
  ```json
  {
    "data": [{
      "id": 1,
      "ratedBy": {...},
      "score": 5,
      "comment": "...",
      "status": "approved"
    }],
    "meta": {...},
    "summary": {"average": 4.8, "total": 45}
  }
  ```

---

## 🌐 Public Pages

### 1. Businesses List (`app/businesses/page.tsx`)
**Functionality:** عرض قائمة الـ businesses
- ✅ `GET /public/businesses` - موجود في Postman
- **Query Parameters المطلوبة:** `keyword`, `category`, `location`, `businessType`, `minRating`, `serviceDistance`, `targetCustomer`, `page`, `per_page`, `sort`
- **Response:** `{ data: [...], meta: {...}, filters: {...} }`

### 2. Business Profile (`app/business/[id]/BusinessProfile.tsx`)
**Functionality:** عرض تفاصيل business
- ✅ `GET /public/businesses/:slug` - موجود في Postman
- ✅ `POST /public/businesses/:slug/reviews` - موجود في Postman
- ✅ `POST /public/businesses/:slug/inquiries` - موجود في Postman
- ✅ `POST /public/reports` - موجود في Postman
- ❌ `GET /public/businesses/:slug/reviews` - **ناقص** (لجلب التقييمات)
- **Request (Review):** `{ score, comment, name, email }`
- **Response:** `{ id, status: "pending_review" }`

### 3. Public Business Profile (`app/profile/[id]/PublicBusinessProfile.tsx`)
**Functionality:** عرض الـ public profile
- ✅ `GET /public/businesses/:slug` - موجود في Postman
- ❌ `GET /public/businesses/:slug/reviews` - **ناقص** (لجلب التقييمات)
- **Response المطلوبة:** نفس `GET /public/businesses/:slug` + reviews

---

## 👨‍💼 Admin Dashboard

### 1. Admin Dashboard (`app/admin/page.tsx`, `components/AdminStats.tsx`)
**Functionality:** عرض إحصائيات الـ admin
- ✅ `GET /admin/dashboard` - موجود في Postman
- ❌ `GET /admin/dashboard/analytics` - **ناقص** (يحتاج إضافة)
- **Response المطلوبة:**
  ```json
  {
    "users": {"total": 2847, "active": 2450, "newThisMonth": 150, "change": 12.5},
    "businesses": {...},
    "reviews": {...},
    "revenue": {...},
    "topCategories": [...],
    "userActivity": [...],
    "systemHealth": {...}
  }
  ```

### 2. Admin Analytics (`components/AdminAnalytics.tsx`)
**Functionality:** عرض تحليلات متقدمة
- ❌ `GET /admin/dashboard/analytics` - **ناقص** (يحتاج إضافة)
- **Query Parameters:** `range` (7|30|90|365 days)
- **Response المطلوبة:** نفس ما في `GET /admin/dashboard` + charts data

### 3. User Management (`components/UserManagement.tsx`)
**Functionality:** إدارة الـ suppliers
- ✅ `GET /admin/suppliers` - موجود في Postman
- ✅ `GET /admin/suppliers/:id` - موجود في Postman
- ✅ `PUT /admin/suppliers/:id` - موجود في Postman
- ✅ `POST /admin/suppliers/:id/status` - موجود في Postman
- ✅ `DELETE /admin/suppliers/:id` - موجود في Postman
- **Query Parameters:** `status`, `plan`, `page`, `per_page`, `search`
- **Response:** `{ data: [...], meta: {...} }`

### 4. Content Management (`components/ContentManagement.tsx`)
**Functionality:** إدارة المحتوى
- ✅ `GET /admin/content` - موجود في Postman
- ✅ `GET /admin/ratings` - موجود في Postman
- ✅ `POST /admin/ratings/:id/approve` - موجود في Postman
- ✅ `POST /admin/ratings/:id/reject` - موجود في Postman
- ✅ `POST /admin/ratings/:id/flag` - موجود في Postman
- ✅ `POST /admin/ratings/:id/restore` - موجود في Postman
- ✅ `GET /admin/documents` - موجود في Postman
- ✅ `POST /admin/documents/:id/approve` - موجود في Postman
- ✅ `POST /admin/documents/:id/reject` - موجود في Postman
- ✅ `POST /admin/documents/:id/request-resubmission` - موجود في Postman
- ✅ `GET /admin/reports` - موجود في Postman
- ✅ `POST /admin/reports/:id/approve` - موجود في Postman
- ✅ `POST /admin/reports/:id/dismiss` - موجود في Postman
- ✅ `POST /admin/reports/:id/takedown` - موجود في Postman
- ✅ `POST /admin/reports/:id/status` - موجود في Postman

### 5. Employee Management (`components/EmployeeManagement.tsx`)
**Functionality:** إدارة الـ admins
- ✅ `GET /admins` - موجود في Postman
- ✅ `GET /admins/:id` - موجود في Postman
- ✅ `POST /admins` - موجود في Postman
- ✅ `PUT /admins/:id` - موجود في Postman
- ✅ `DELETE /admins/:id` - موجود في Postman
- ✅ `POST /admins/register-super` - موجود في Postman
- **Request (POST):** `{ name, email, password, password_confirmation, role, department, job_role, permissions }`
- **Response:** `{ id, name, email, role }`

### 6. Admin Profile (`components/SystemSettings.tsx`)
**Functionality:** إدارة بيانات الـ admin
- ❌ `GET /admin/profile` - **ناقص** (يحتاج إضافة)
- ✅ `PUT /admin/profile` - موجود في Postman
- ✅ `POST /admin/profile/image` - موجود في Postman
- **Response المطلوبة:**
  ```json
  {
    "id": 1,
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin",
    "department": "IT",
    "job_role": "Manager",
    "permissions": {...},
    "profileImage": "..."
  }
  ```

---

## 📊 ملخص Endpoints الناقصة

### 🔴 عالية الأولوية (يجب إضافتها فوراً)

1. **`GET /supplier/profile`**
   - الاستخدام: `components/BusinessManagement.tsx`, `app/dashboard/page.tsx`
   - الوصف: جلب بيانات الـ supplier الكاملة

2. **`GET /supplier/ratings`**
   - الاستخدام: `components/DashboardStats.tsx`, `app/profile/[id]/PublicBusinessProfile.tsx`
   - الوصف: جلب التقييمات التي استلمها الـ supplier
   - Query Parameters: `scope`, `page`, `per_page`, `status`

3. **`GET /supplier/dashboard/analytics`**
   - الاستخدام: `components/DashboardAnalytics.tsx`, `components/DashboardStats.tsx`
   - الوصف: جلب إحصائيات متقدمة للـ dashboard
   - Query Parameters: `range` (7|30|90 days)

4. **`GET /admin/profile`**
   - الاستخدام: `components/SystemSettings.tsx`, `app/admin/page.tsx`
   - الوصف: جلب بيانات الـ admin

5. **`GET /admin/dashboard/analytics`**
   - الاستخدام: `components/AdminAnalytics.tsx`, `components/AdminStats.tsx`
   - الوصف: جلب إحصائيات متقدمة للـ admin dashboard
   - Query Parameters: `range` (7|30|90|365 days)

6. **`GET /public/businesses/:slug/reviews`**
   - الاستخدام: `app/business/[id]/BusinessProfile.tsx`, `app/profile/[id]/PublicBusinessProfile.tsx`
   - الوصف: جلب التقييمات المعتمدة لـ business معين
   - Query Parameters: `page`, `per_page`, `sort`

---

## ⚠️ Endpoints تحتاج تعديل

1. **`POST /supplier/inquiries/:id/reply`**
   - المشكلة: يرسل `message` فقط
   - التعديل المطلوب: إضافة `subject` (optional) في الـ request body
   - الاستخدام: `components/DashboardMessages.tsx`

2. **`PUT /supplier/profile`**
   - المشكلة: يرسل كل الحقول
   - التعديل المطلوب: إضافة `PATCH /supplier/profile` للـ partial updates
   - الاستخدام: `components/BusinessManagement.tsx`

3. **`PUT /branches/:id`**
   - المشكلة: يرسل كل الحقول
   - التعديل المطلوب: إضافة `PATCH /branches/:id` للـ partial updates
   - الاستخدام: `components/BranchManagement.tsx`

---

## ✅ Endpoints الموجودة والمستخدمة

جميع الـ endpoints التالية موجودة في Postman collection ومستخدمة في الفرونت:

### Auth
- ✅ `POST /auth/login`
- ✅ `POST /auth/send-otp`
- ✅ `POST /auth/verify-otp`
- ✅ `POST /auth/forgot-password`
- ✅ `POST /auth/reset-password`
- ✅ `POST /auth/logout`
- ✅ `POST /auth/change-password`

### Registration
- ✅ `POST /supplier/register`
- ✅ `POST /admins/register-super`

### Supplier
- ✅ `GET /supplier/dashboard`
- ✅ `PUT /supplier/profile`
- ✅ `POST /supplier/profile/image`
- ✅ `POST /supplier/ratings` (لتقييم supplier آخر)
- ✅ `GET /supplier/documents`
- ✅ `POST /supplier/documents`
- ✅ `DELETE /supplier/documents/:id`
- ✅ `POST /supplier/documents/:id/resubmit`
- ✅ `GET /supplier/reports`
- ✅ `POST /supplier/reports`
- ✅ `GET /supplier/inquiries`
- ✅ `POST /supplier/inquiries/:id/reply`
- ✅ `POST /supplier/inquiries/:id/mark-read`
- ✅ `POST /supplier/inquiries/:id/status`

### Branches
- ✅ `GET /branches`
- ✅ `GET /branches/:id`
- ✅ `POST /branches`
- ✅ `PUT /branches/:id`
- ✅ `DELETE /branches/:id`

### Public
- ✅ `GET /public/businesses`
- ✅ `GET /public/businesses/:slug`
- ✅ `POST /public/businesses/:slug/reviews`
- ✅ `POST /public/businesses/:slug/inquiries`
- ✅ `POST /public/reports`

### Admin
- ✅ `GET /admin/dashboard`
- ✅ `GET /admin/dashboard/analytics` (موجود لكن يحتاج تحسين response structure)
- ✅ `GET /admin/content`
- ✅ `GET /admin/suppliers`
- ✅ `GET /admin/suppliers/:id`
- ✅ `PUT /admin/suppliers/:id`
- ✅ `POST /admin/suppliers/:id/status`
- ✅ `DELETE /admin/suppliers/:id`
- ✅ `GET /admin/ratings`
- ✅ `POST /admin/ratings/:id/approve`
- ✅ `POST /admin/ratings/:id/reject`
- ✅ `POST /admin/ratings/:id/flag`
- ✅ `POST /admin/ratings/:id/restore`
- ✅ `GET /admin/documents`
- ✅ `POST /admin/documents/:id/approve`
- ✅ `POST /admin/documents/:id/reject`
- ✅ `POST /admin/documents/:id/request-resubmission`
- ✅ `GET /admin/reports`
- ✅ `POST /admin/reports/:id/approve`
- ✅ `POST /admin/reports/:id/dismiss`
- ✅ `POST /admin/reports/:id/takedown`
- ✅ `POST /admin/reports/:id/status`
- ✅ `PUT /admin/profile`
- ✅ `POST /admin/profile/image`

### Super Admin
- ✅ `GET /admins`
- ✅ `GET /admins/:id`
- ✅ `POST /admins`
- ✅ `PUT /admins/:id`
- ✅ `DELETE /admins/:id`

---

## 📝 ملاحظات

1. **الأولوية للفرونت:** تم فحص جميع الـ components والـ pages في الفرونت إند
2. **التوافق:** جميع الـ endpoints المطلوبة في الفرونت موجودة في `BACKEND_API_SPECIFICATION.md`
3. **التوثيق:** كل endpoint موثق بالكامل في الملف الرئيسي

---

**تاريخ الإنشاء:** 2024-01-20  
**الإصدار:** 1.0

