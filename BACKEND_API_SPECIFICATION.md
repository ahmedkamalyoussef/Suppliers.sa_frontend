# Backend API Specification - Suppliers.sa

## 📋 ملخص تنفيذي

هذا الملف يحتوي على المواصفات الكاملة للـ API endpoints المطلوبة للربط مع الفرونت إند. تم تحليل جميع الـ components والـ pages في الفرونت إند لتحديد الـ endpoints المطلوبة.

---

## 🔴 Endpoints الناقصة (يجب إضافتها فوراً)

### 1. Supplier Endpoints

#### 1.1 Get Supplier Profile
```
GET /supplier/profile
```
**الوصف:** جلب بيانات الـ supplier الكاملة

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Response (200 OK):**
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
  "profileImage": "https://example.com/image.jpg",
  "status": "active",
  "verificationStatus": "pending_verification",
  "plan": "Premium",
  "rating": {
    "average": 4.8,
    "total": 124
  },
  "workingHours": {
    "monday": {"open": "08:00", "close": "18:00", "closed": false},
    "tuesday": {"open": "08:00", "close": "18:00", "closed": false},
    "wednesday": {"open": "08:00", "close": "18:00", "closed": false},
    "thursday": {"open": "08:00", "close": "18:00", "closed": false},
    "friday": {"open": "08:00", "close": "18:00", "closed": false},
    "saturday": {"open": "09:00", "close": "17:00", "closed": false},
    "sunday": {"open": "10:00", "close": "16:00", "closed": false}
  },
  "productKeywords": ["LED TV", "Samsung", "iPhone repair"],
  "targetCustomers": ["Large Organizations", "Small Businesses"],
  "additionalPhones": [
    {
      "id": 1,
      "type": "Sales Representative",
      "number": "+966500000002",
      "name": "Ahmed"
    }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-20T15:30:00Z"
}
```

**الاستخدام في الفرونت:**
- `components/BusinessManagement.tsx` - عرض وتعديل بيانات الـ supplier
- `app/dashboard/page.tsx` - عرض معلومات الـ supplier في الـ dashboard

---

#### 1.2 Get Supplier Ratings (Received)
```
GET /supplier/ratings
```
**الوصف:** جلب التقييمات التي استلمها الـ supplier

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Query Parameters:**
- `scope` (optional): "received" | "given" - Default: "received"
- `page` (optional): number - Default: 1
- `per_page` (optional): number - Default: 15
- `status` (optional): "approved" | "pending_review" | "rejected" - Default: "approved"

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "ratedBy": {
        "id": 2,
        "name": "Customer Name",
        "businessName": "Customer Business",
        "avatar": "https://example.com/avatar.jpg"
      },
      "score": 5,
      "comment": "Excellent service and quality products",
      "createdAt": "2024-01-20T10:00:00Z",
      "status": "approved",
      "response": {
        "id": 1,
        "message": "Thank you for your feedback!",
        "createdAt": "2024-01-21T09:00:00Z"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 45,
    "last_page": 3,
    "from": 1,
    "to": 15
  },
  "summary": {
    "average": 4.8,
    "total": 45,
    "distribution": {
      "5": 30,
      "4": 10,
      "3": 3,
      "2": 1,
      "1": 1
    }
  }
}
```

**الاستخدام في الفرونت:**
- `components/DashboardStats.tsx` - عرض متوسط التقييم
- `app/profile/[id]/PublicBusinessProfile.tsx` - عرض التقييمات في الـ public profile
- `components/BusinessCard.tsx` - عرض التقييم في البطاقة

---

#### 1.3 Get Supplier Dashboard Analytics
```
GET /supplier/dashboard/analytics
```
**الوصف:** جلب إحصائيات الـ dashboard للـ supplier

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Query Parameters:**
- `range` (optional): "7" | "30" | "90" | "365" - Default: "30" (days)

**Response (200 OK):**
```json
{
  "views": {
    "total": 1250,
    "thisMonth": 320,
    "change": 15.5,
    "trend": "up",
    "chartData": [120, 180, 250, 200, 300, 280, 350, 400, 380, 450]
  },
  "contacts": {
    "total": 89,
    "thisMonth": 23,
    "change": 8.2,
    "trend": "up"
  },
  "inquiries": {
    "total": 45,
    "thisMonth": 12,
    "change": -5.2,
    "trend": "down",
    "pending": 5,
    "responded": 7
  },
  "ratings": {
    "average": 4.8,
    "total": 120,
    "thisMonth": 15,
    "change": 0.2,
    "trend": "up"
  },
  "recentActivities": [
    {
      "id": 1,
      "type": "inquiry",
      "title": "New inquiry from Sarah Johnson",
      "message": "Looking for LED TVs in bulk",
      "time": "2 hours ago",
      "icon": "ri-message-line",
      "color": "text-blue-600 bg-blue-100"
    },
    {
      "id": 2,
      "type": "view",
      "title": "Profile viewed by Tech Solutions Co.",
      "message": "Viewed your electronics category",
      "time": "4 hours ago",
      "icon": "ri-eye-line",
      "color": "text-green-600 bg-green-100"
    }
  ],
  "topSearchKeywords": [
    {"keyword": "LED TV", "searches": 156, "change": 12},
    {"keyword": "Samsung electronics", "searches": 134, "change": 8}
  ],
  "customerInsights": {
    "demographics": [
      {"type": "Large Organizations", "percentage": 45, "count": 127},
      {"type": "Small Businesses", "percentage": 35, "count": 98},
      {"type": "Individuals", "percentage": 20, "count": 56}
    ],
    "topLocations": [
      {"city": "Riyadh", "visitors": 234, "percentage": 42},
      {"city": "Jeddah", "visitors": 156, "percentage": 28}
    ]
  }
}
```

**الاستخدام في الفرونت:**
- `components/DashboardAnalytics.tsx` - عرض جميع الإحصائيات والـ charts
- `components/DashboardStats.tsx` - عرض الـ stats cards

---

### 2. Admin Endpoints

#### 2.1 Get Admin Profile
```
GET /admin/profile
```
**الوصف:** جلب بيانات الـ admin

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Admin Name",
  "email": "admin@example.com",
  "role": "admin",
  "department": "IT",
  "job_role": "Manager",
  "profileImage": "https://example.com/avatar.jpg",
  "permissions": {
    "user_management_view": true,
    "user_management_edit": false,
    "user_management_delete": false,
    "user_management_full": false,
    "content_management_view": false,
    "content_management_supervise": true,
    "content_management_delete": false,
    "analytics_view": true,
    "analytics_export": false,
    "reports_view": true,
    "reports_create": false,
    "system_manage": false,
    "system_settings": false,
    "system_backups": false,
    "support_manage": false
  },
  "createdAt": "2024-01-01T10:00:00Z",
  "lastLogin": "2024-01-20T15:30:00Z"
}
```

**الاستخدام في الفرونت:**
- `app/admin/page.tsx` - عرض معلومات الـ admin
- `components/SystemSettings.tsx` - عرض الصلاحيات

---

#### 2.2 Get Admin Dashboard Analytics
```
GET /admin/dashboard/analytics
```
**الوصف:** جلب إحصائيات الـ dashboard للـ admin

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Query Parameters:**
- `range` (optional): "7" | "30" | "90" | "365" - Default: "30" (days)

**Response (200 OK):**
```json
{
  "users": {
    "total": 2847,
    "active": 2450,
    "newThisMonth": 150,
    "change": 12.5,
    "trend": "up",
    "chartData": [2100, 2300, 2450, 2600, 2720, 2800, 2847]
  },
  "businesses": {
    "total": 1234,
    "verified": 1100,
    "pending": 30,
    "suspended": 104,
    "change": 8.2,
    "trend": "up",
    "chartData": [980, 1050, 1120, 1180, 1200, 1220, 1234]
  },
  "reviews": {
    "total": 5000,
    "pending": 25,
    "approved": 4800,
    "rejected": 175,
    "change": 5.3,
    "trend": "up"
  },
  "revenue": {
    "total": 45678,
    "thisMonth": 12000,
    "change": 17.3,
    "trend": "up",
    "byPlan": [
      {"plan": "Enterprise", "revenue": 22890, "users": 89},
      {"plan": "Premium", "revenue": 15640, "users": 234},
      {"plan": "Basic", "revenue": 7148, "users": 533}
    ],
    "chartData": [28000, 32000, 35000, 41000, 38000, 42000, 45678]
  },
  "topCategories": [
    {"name": "Technology", "businesses": 324, "revenue": "$12,450", "growth": 18.5},
    {"name": "Electronics", "businesses": 289, "revenue": "$9,870", "growth": 12.3}
  ],
  "userActivity": [
    {
      "date": "2024-01-14",
      "newUsers": 45,
      "activeUsers": 1230,
      "revenue": 2340
    }
  ],
  "systemHealth": {
    "serverStatus": "online",
    "database": "healthy",
    "security": "protected",
    "uptime": "99.8%"
  }
}
```

**الاستخدام في الفرونت:**
- `components/AdminAnalytics.tsx` - عرض جميع الإحصائيات
- `components/AdminStats.tsx` - عرض الـ stats cards

---

### 3. Public Endpoints

#### 3.1 Search Businesses (Enhanced)
```
GET /public/businesses
```
**الوصف:** البحث عن الـ businesses مع دعم فلاتر متقدمة

**Headers:**
```
Accept: application/json
```

**Query Parameters:**
- `keyword` (optional): string - للبحث في الاسم والوصف والكلمات المفتاحية
- `category` (optional): string - تصفية حسب الفئة
- `location` (optional): string - تصفية حسب الموقع
- `businessType` (optional): "Supplier" | "Store" | "Office" | "Individual"
- `minRating` (optional): number (1-5) - الحد الأدنى للتقييم
- `serviceDistance` (optional): number - المسافة بالكيلومتر
- `targetCustomer` (optional): string - نوع العملاء المستهدفين
- `page` (optional): number - Default: 1
- `per_page` (optional): number - Default: 12
- `sort` (optional): "relevance" | "rating" | "reviews" | "newest" | "distance" - Default: "relevance"

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "slug": "metro-electronics",
      "name": "Metro Electronics Supply",
      "category": "Electronics",
      "businessType": "Supplier",
      "location": "Riyadh",
      "address": "1247 King Fahd Road, Al-Olaya District",
      "rating": 4.8,
      "reviews": 124,
      "verified": true,
      "openNow": true,
      "lat": 24.7136,
      "lng": 46.6753,
      "image": "https://example.com/image.jpg",
      "services": ["Wholesale", "Repair"],
      "targetCustomers": ["Large Organizations", "Small Businesses"],
      "serviceDistance": "40 km",
      "distance": 5.2
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 12,
    "total": 150,
    "last_page": 13,
    "from": 1,
    "to": 12
  },
  "filters": {
    "categories": ["Electronics", "Technology", "Construction"],
    "locations": ["Riyadh", "Jeddah", "Dammam"],
    "businessTypes": ["Supplier", "Store", "Office"]
  }
}
```

**الاستخدام في الفرونت:**
- `app/businesses/page.tsx` - صفحة البحث الرئيسية
- `components/SearchSection.tsx` - البحث المتقدم
- `components/BusinessFilters.tsx` - الفلاتر

---

#### 3.2 Get Business Reviews (Public)
```
GET /public/businesses/:slug/reviews
```
**الوصف:** جلب التقييمات المعتمدة لـ business معين

**Headers:**
```
Accept: application/json
```

**Query Parameters:**
- `page` (optional): number - Default: 1
- `per_page` (optional): number - Default: 10
- `sort` (optional): "newest" | "oldest" | "highest" | "lowest" - Default: "newest"

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "customerName": "Customer Name",
      "rating": 5,
      "comment": "Excellent service and quality products",
      "date": "2024-01-20T10:00:00Z",
      "verified": true,
      "response": {
        "message": "Thank you for your feedback!",
        "date": "2024-01-21T09:00:00Z"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 45,
    "last_page": 5
  },
  "summary": {
    "average": 4.8,
    "total": 45,
    "distribution": {
      "5": 30,
      "4": 10,
      "3": 3,
      "2": 1,
      "1": 1
    }
  }
}
```

**الاستخدام في الفرونت:**
- `app/business/[id]/BusinessProfile.tsx` - عرض التقييمات
- `app/profile/[id]/PublicBusinessProfile.tsx` - عرض التقييمات في الـ public profile

---

### 4. Supplier Ratings Endpoints

#### 4.1 Submit Supplier Rating
```
POST /supplier/ratings
```
**الوصف:** إرسال تقييم من supplier لـ supplier آخر

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
  "ratedSupplierId": 2,
  "score": 4,
  "comment": "Excellent partner"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "ratedSupplierId": 2,
  "ratedBy": {
    "id": 1,
    "name": "Your Business Name"
  },
  "score": 4,
  "comment": "Excellent partner",
  "status": "pending_review",
  "createdAt": "2024-01-20T10:00:00Z",
  "message": "Rating submitted successfully and is pending admin approval"
}
```

**الاستخدام في الفرونت:**
- `components/DashboardMessages.tsx` - قد يحتاج إرسال تقييمات

---

## ⚠️ Endpoints تحتاج تعديل

### 1. Supplier Profile Update

**المشكلة الحالية:**
- Postman: `PUT /supplier/profile` - يرسل كل الحقول

**التوصية:**
- إضافة `PATCH /supplier/profile` للـ partial updates
- أو تعديل `PUT` ليقبل partial updates

**Request Body (PATCH):**
```json
{
  "businessName": "Updated Name",
  "description": "Updated description"
  // يمكن إرسال أي حقل أو مجموعة حقول
}
```

**الاستخدام في الفرونت:**
- `components/BusinessManagement.tsx` - قد يحتاج تحديث جزئي

---

### 2. Branch Update

**المشكلة الحالية:**
- Postman: `PUT /branches/:id` - يرسل كل الحقول

**التوصية:**
- إضافة `PATCH /branches/:id` للـ partial updates

**Request Body (PATCH):**
```json
{
  "name": "Updated Branch Name",
  "status": "inactive"
  // يمكن إرسال أي حقل أو مجموعة حقول
}
```

**الاستخدام في الفرونت:**
- `components/BranchManagement.tsx` - قد يحتاج تحديث جزئي

---

### 3. Inquiry Reply

**المشكلة الحالية:**
- Postman: `POST /supplier/inquiries/:id/reply` - يرسل `message` فقط

**التوصية:**
- إضافة `subject` (optional) في الـ request body

**Request Body:**
```json
{
  "message": "Thanks for reaching out, we will contact you soon.",
  "subject": "Re: Your Inquiry" // optional
}
```

**الاستخدام في الفرونت:**
- `components/DashboardMessages.tsx` - الرد على الاستفسارات

---

## ✅ Endpoints الموجودة (تحتاج فقط تحسينات)

### 1. Auth Endpoints

#### Login
```
POST /auth/login
```
**Request:**
```json
{
  "email": "a@gmail.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "Ahmed Al-Rashid",
    "email": "a@gmail.com",
    "role": "supplier",
    "businessName": "Metro Electronics",
    "profileImage": "https://example.com/image.jpg"
  },
  "expiresAt": "2024-01-21T10:00:00Z"
}
```

**الاستخدام في الفرونت:**
- `app/auth/page.tsx` - تسجيل الدخول

---

#### Send OTP
```
POST /auth/send-otp
```
**Request:**
```json
{
  "email": "ahmed0a41468@gmail.com"
}
```

**Response (200 OK):**
```json
{
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```

**الاستخدام في الفرونت:**
- `app/auth/page.tsx` - إرسال OTP

---

#### Verify OTP
```
POST /auth/verify-otp
```
**Request:**
```json
{
  "email": "ahmed0a41468@gmail.com",
  "otp": "554408"
}
```

**Response (200 OK):**
```json
{
  "verified": true,
  "message": "OTP verified successfully"
}
```

**الاستخدام في الفرونت:**
- `app/auth/page.tsx` - التحقق من OTP

---

#### Forgot Password
```
POST /auth/forgot-password
```
**Request:**
```json
{
  "email": "supplier@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset OTP sent to your email"
}
```

**الاستخدام في الفرونت:**
- `app/forgot-password/page.tsx` - نسيان كلمة المرور

---

#### Reset Password
```
POST /auth/reset-password
```
**Request:**
```json
{
  "email": "supplier@example.com",
  "otp": "123456",
  "password": "new-password",
  "password_confirmation": "new-password"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

**الاستخدام في الفرونت:**
- `app/forgot-password/page.tsx` - إعادة تعيين كلمة المرور

---

#### Logout
```
POST /auth/logout
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**الاستخدام في الفرونت:**
- جميع الصفحات - تسجيل الخروج

---

#### Change Password
```
POST /auth/change-password
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "current_password": "password",
  "password": "new-password",
  "password_confirmation": "new-password"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**الاستخدام في الفرونت:**
- `components/DashboardSettings.tsx` - تغيير كلمة المرور

---

### 2. Registration Endpoints

#### Supplier Registration
```
POST /supplier/register
```
**Request:**
```json
{
  "businessName": "Metro Electronics",
  "email": "ahmed0a41468@gmail.com",
  "phone": "+966500000000",
  "password": "123456",
  "password_confirmation": "123456"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "businessName": "Metro Electronics",
  "email": "ahmed0a41468@gmail.com",
  "phone": "+966500000000",
  "status": "pending_verification",
  "message": "Registration successful. Please verify your email."
}
```

**الاستخدام في الفرونت:**
- `app/auth/page.tsx` - تسجيل supplier جديد
- `components/CompleteProfileForm.tsx` - إكمال التسجيل

---

### 3. Supplier Endpoints

#### Dashboard Overview
```
GET /supplier/dashboard
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "stats": {
    "views": {"current": 1247, "change": 12.5, "trend": "up"},
    "contacts": {"current": 89, "change": 8.2, "trend": "up"},
    "inquiries": {"current": 34, "change": -3.1, "trend": "down"},
    "rating": {"current": 4.8, "change": 0.2, "trend": "up"}
  },
  "recentActivities": [
    {
      "id": 1,
      "type": "inquiry",
      "title": "New inquiry from Sarah Johnson",
      "message": "Looking for LED TVs in bulk",
      "time": "2 hours ago"
    }
  ],
  "quickActions": [
    {
      "title": "Update Business Hours",
      "description": "Modify your working schedule",
      "action": "hours"
    }
  ]
}
```

**الاستخدام في الفرونت:**
- `app/dashboard/page.tsx` - عرض الـ dashboard
- `components/DashboardStats.tsx` - عرض الإحصائيات

---

#### Update Profile
```
PUT /supplier/profile
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "businessName": "Metro Electronics",
  "businessType": "Supplier",
  "categories": ["Electronics", "Technology"],
  "services": ["Wholesale", "Repair"],
  "description": "We provide electronics.",
  "website": "https://metroelectronics.com",
  "address": "Riyadh",
  "serviceDistance": 40,
  "contactPhone": "+966500000001",
  "contactEmail": "contact@metroelectronics.com"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "businessName": "Metro Electronics",
  "message": "Profile updated successfully"
}
```

**الاستخدام في الفرونت:**
- `components/BusinessManagement.tsx` - تحديث بيانات الـ supplier

---

#### Upload Profile Image
```
POST /supplier/profile/image
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request (FormData):**
```
profile_image: [file]
```

**Response (200 OK):**
```json
{
  "profileImage": "https://example.com/uploads/profile_123.jpg",
  "message": "Profile image uploaded successfully"
}
```

**الاستخدام في الفرونت:**
- `components/BusinessManagement.tsx` - رفع صورة الـ profile
- `app/dashboard/page.tsx` - تحديث صورة الـ avatar

---

### 4. Documents Endpoints

#### List Documents
```
GET /supplier/documents
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "documentType": "Commercial Registration",
      "referenceNumber": "CR-123456",
      "issueDate": "2024-01-01",
      "expiryDate": "2025-01-01",
      "status": "pending_verification",
      "documentUrl": "https://example.com/documents/cr_123.pdf",
      "notes": "Uploaded for verification",
      "uploadedAt": "2024-01-15T10:00:00Z",
      "reviewedAt": null,
      "reviewer": null
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 3
  }
}
```

**الاستخدام في الفرونت:**
- `components/CompleteProfileForm.tsx` - عرض المستندات المرفوعة
- `app/verification-status/page.tsx` - حالة التحقق

---

#### Upload Document
```
POST /supplier/documents
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request (FormData):**
```
documentType: "Commercial Registration"
referenceNumber: "CR-123456"
issueDate: "2024-01-01"
expiryDate: "2025-01-01"
notes: "Uploaded for verification"
document: [file]
```

**Response (201 Created):**
```json
{
  "id": 1,
  "documentType": "Commercial Registration",
  "status": "pending_verification",
  "message": "Document uploaded successfully"
}
```

**الاستخدام في الفرونت:**
- `components/CompleteProfileForm.tsx` - رفع المستندات

---

#### Delete Document
```
DELETE /supplier/documents/:id
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Document deleted successfully"
}
```

**الاستخدام في الفرونت:**
- `components/CompleteProfileForm.tsx` - حذف المستندات

---

#### Resubmit Document
```
POST /supplier/documents/:id/resubmit
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request (FormData):**
```
notes: "Updated document"
document: [file] // optional - إذا لم يتم إرسال ملف جديد، يتم الاحتفاظ بالملف القديم
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "pending_verification",
  "message": "Document resubmitted successfully"
}
```

**الاستخدام في الفرونت:**
- `components/CompleteProfileForm.tsx` - إعادة رفع المستندات

---

### 5. Inquiries Endpoints

#### List Inquiries
```
GET /supplier/inquiries
```
**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): "pending" | "responded" | "all" - Default: "all"
- `page` (optional): number - Default: 1
- `per_page` (optional): number - Default: 15

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "from": "Sarah Johnson",
      "company": "Tech Solutions Co.",
      "subject": "Bulk order inquiry for LED TVs",
      "message": "Hi, I am interested in placing a bulk order...",
      "email": "sarah.johnson@techsolutions.com",
      "phone": "+966 50 987 6543",
      "status": "pending",
      "createdAt": "2024-01-20T08:00:00Z",
      "readAt": null,
      "repliedAt": null
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 45,
    "last_page": 3
  }
}
```

**الاستخدام في الفرونت:**
- `components/DashboardMessages.tsx` - عرض الاستفسارات

---

#### Reply to Inquiry
```
POST /supplier/inquiries/:id/reply
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "message": "Thanks for reaching out, we will contact you soon.",
  "subject": "Re: Your Inquiry" // optional
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "responded",
  "repliedAt": "2024-01-20T10:00:00Z",
  "message": "Reply sent successfully"
}
```

**الاستخدام في الفرونت:**
- `components/DashboardMessages.tsx` - الرد على الاستفسارات

---

#### Mark Inquiry as Read
```
POST /supplier/inquiries/:id/mark-read
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "readAt": "2024-01-20T10:00:00Z",
  "message": "Inquiry marked as read"
}
```

**الاستخدام في الفرونت:**
- `components/DashboardMessages.tsx` - تحديد الاستفسارات كمقروءة

---

#### Update Inquiry Status
```
POST /supplier/inquiries/:id/status
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "status": "responded"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "responded",
  "message": "Status updated successfully"
}
```

**الاستخدام في الفرونت:**
- `components/DashboardMessages.tsx` - تحديث حالة الاستفسار

---

### 6. Branches Endpoints

#### List Branches
```
GET /branches
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Main Branch",
      "phone": "+966500000002",
      "email": "branch@metroelectronics.com",
      "address": "Riyadh",
      "manager": "Branch Manager",
      "location": {"lat": 24.7136, "lng": 46.6753},
      "workingHours": {
        "monday": {"open": "09:00", "close": "17:00", "closed": false}
      },
      "specialServices": [],
      "status": "active",
      "isMainBranch": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 5
  }
}
```

**الاستخدام في الفرونت:**
- `components/BranchManagement.tsx` - عرض الفروع

---

#### Get Branch by ID
```
GET /branches/:id
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Main Branch",
  "phone": "+966500000002",
  "email": "branch@metroelectronics.com",
  "address": "Riyadh",
  "manager": "Branch Manager",
  "location": {"lat": 24.7136, "lng": 46.6753},
  "workingHours": {
    "monday": {"open": "09:00", "close": "17:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "17:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "17:00", "closed": false},
    "thursday": {"open": "09:00", "close": "17:00", "closed": false},
    "friday": {"open": "09:00", "close": "17:00", "closed": false},
    "saturday": {"open": "10:00", "close": "16:00", "closed": false},
    "sunday": {"open": "10:00", "close": "16:00", "closed": true}
  },
  "specialServices": ["Express Delivery", "Installation"],
  "status": "active",
  "isMainBranch": true
}
```

**الاستخدام في الفرونت:**
- `components/BranchManagement.tsx` - عرض تفاصيل فرع معين

---

#### Create Branch
```
POST /branches
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Main Branch",
  "phone": "+966500000002",
  "email": "branch@metroelectronics.com",
  "address": "Riyadh",
  "manager": "Branch Manager",
  "location": {"lat": 24.7136, "lng": 46.6753},
  "workingHours": {
    "monday": {"open": "09:00", "close": "17:00", "closed": false}
  },
  "specialServices": [],
  "status": "active",
  "isMainBranch": true
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Main Branch",
  "message": "Branch created successfully"
}
```

**الاستخدام في الفرونت:**
- `components/BranchManagement.tsx` - إنشاء فرع جديد

---

#### Update Branch
```
PUT /branches/:id
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Updated Branch",
  "status": "inactive",
  "isMainBranch": false
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Updated Branch",
  "message": "Branch updated successfully"
}
```

**الاستخدام في الفرونت:**
- `components/BranchManagement.tsx` - تحديث بيانات الفرع

---

#### Delete Branch
```
DELETE /branches/:id
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Branch deleted successfully"
}
```

**الاستخدام في الفرونت:**
- `components/BranchManagement.tsx` - حذف فرع

---

### 7. Public Endpoints

#### List Businesses
```
GET /public/businesses
```
**Query Parameters:**
- `keyword` (optional): string

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "slug": "metro-electronics",
      "name": "Metro Electronics Supply",
      "category": "Electronics",
      "rating": 4.8,
      "reviews": 124,
      "location": "Riyadh"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 150
  }
}
```

**الاستخدام في الفرونت:**
- `app/businesses/page.tsx` - قائمة الـ businesses

---

#### Business Details
```
GET /public/businesses/:slug
```
**Response (200 OK):**
```json
{
  "id": 1,
  "slug": "metro-electronics",
  "name": "Metro Electronics Supply",
  "category": "Electronics Supplier",
  "businessType": "Supplier",
  "targetCustomers": ["Large Organizations", "Small Businesses"],
  "serviceDistance": "40 km",
  "rating": 4.8,
  "reviewCount": 124,
  "description": "Metro Electronics Supply is your trusted partner...",
  "address": "1247 King Fahd Road, Al-Olaya District, Riyadh 12313",
  "phone": "+966 11 234 5678",
  "email": "info@metroelectronics.com",
  "website": "https://metroelectronics.com",
  "coordinates": {"lat": 24.7136, "lng": 46.6753},
  "services": ["Wholesale Electronics", "Components Supply"],
  "productsAndServices": ["LED TVs", "Samsung TVs", "iPhone Repair"],
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "workingHours": {
    "monday": {"open": "08:00", "close": "18:00", "closed": false}
  },
  "branches": [
    {
      "id": 1,
      "name": "Main Branch",
      "address": "Riyadh",
      "phone": "+966500000002"
    }
  ],
  "verified": true,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**الاستخدام في الفرونت:**
- `app/business/[id]/BusinessProfile.tsx` - عرض تفاصيل الـ business
- `app/profile/[id]/PublicBusinessProfile.tsx` - الـ public profile

---

#### Submit Public Review
```
POST /public/businesses/:slug/reviews
```
**Request:**
```json
{
  "score": 5,
  "comment": "Great service!",
  "name": "Visitor",
  "email": "visitor@example.com"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "status": "pending_review",
  "message": "Review submitted successfully and is pending admin approval"
}
```

**الاستخدام في الفرونت:**
- `app/business/[id]/BusinessProfile.tsx` - إرسال تقييم

---

#### Submit Inquiry
```
POST /public/businesses/:slug/inquiries
```
**Request:**
```json
{
  "name": "Visitor",
  "email": "visitor@example.com",
  "phone": "+966500000000",
  "company": "Guest LLC",
  "subject": "Pricing",
  "message": "Need pricing info."
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "message": "Inquiry submitted successfully"
}
```

**الاستخدام في الفرونت:**
- `app/business/[id]/BusinessProfile.tsx` - إرسال استفسار
- `app/profile/[id]/PublicBusinessProfile.tsx` - إرسال استفسار

---

#### Submit Content Report
```
POST /public/reports
```
**Request:**
```json
{
  "businessSlug": "sample-slug",
  "reportType": "profile",
  "reason": "Inaccurate info",
  "details": "Address needs update",
  "name": "Visitor",
  "email": "visitor@example.com"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "message": "Report submitted successfully"
}
```

**الاستخدام في الفرونت:**
- `app/business/[id]/BusinessProfile.tsx` - الإبلاغ عن محتوى

---

### 8. Admin Endpoints

#### Dashboard Overview
```
GET /admin/dashboard
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "stats": {
    "totalUsers": 2847,
    "activeBusinesses": 1234,
    "monthlyRevenue": 45678,
    "systemHealth": "99.8%"
  },
  "pendingActions": [
    {
      "title": "Business Verification",
      "count": 12,
      "priority": "high"
    }
  ],
  "recentActivities": [
    {
      "type": "user_registration",
      "message": "New business registered: Tech Solutions Co.",
      "time": "5 minutes ago"
    }
  ]
}
```

**الاستخدام في الفرونت:**
- `app/admin/page.tsx` - عرض الـ dashboard
- `components/AdminStats.tsx` - عرض الإحصائيات

---

#### Content Overview
```
GET /admin/content
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "totalBusinesses": 1234,
  "pendingReviews": 25,
  "docVerification": 30,
  "reportedContent": 8,
  "approvedToday": 15
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - عرض إحصائيات المحتوى

---

#### List Suppliers (Admin)
```
GET /admin/suppliers
```
**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): "active" | "suspended" | "pending" | "all"
- `plan` (optional): "Basic" | "Premium" | "Enterprise" | "all"
- `page` (optional): number
- `per_page` (optional): number
- `search` (optional): string

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "businessName": "Metro Electronics",
      "email": "info@metroelectronics.com",
      "phone": "+966500000000",
      "plan": "Premium",
      "status": "active",
      "verificationStatus": "verified",
      "joinDate": "2024-01-15",
      "lastActive": "2024-01-20",
      "revenue": "$290",
      "profileCompletion": 95
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100
  }
}
```

**الاستخدام في الفرونت:**
- `components/UserManagement.tsx` - عرض قائمة الـ suppliers

---

#### Show Supplier (Admin)
```
GET /admin/suppliers/:id
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "businessName": "Metro Electronics",
  "email": "info@metroelectronics.com",
  "phone": "+966500000000",
  "plan": "Premium",
  "status": "active",
  "verificationStatus": "verified",
  "profileCompletion": 95,
  "joinDate": "2024-01-15",
  "lastActive": "2024-01-20",
  "revenue": "$290",
  "documents": [
    {
      "id": 1,
      "type": "Commercial Registration",
      "status": "verified"
    }
  ],
  "ratings": {
    "average": 4.8,
    "total": 124
  }
}
```

**الاستخدام في الفرونت:**
- `components/UserManagement.tsx` - عرض تفاصيل supplier

---

#### Update Supplier (Admin)
```
PUT /admin/suppliers/:id
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "plan": "Premium",
  "status": "active"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "plan": "Premium",
  "status": "active",
  "message": "Supplier updated successfully"
}
```

**الاستخدام في الفرونت:**
- `components/UserManagement.tsx` - تحديث بيانات supplier

---

#### Update Supplier Status
```
POST /admin/suppliers/:id/status
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "status": "suspended"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "suspended",
  "message": "Status updated successfully"
}
```

**الاستخدام في الفرونت:**
- `components/UserManagement.tsx` - تغيير حالة supplier

---

#### Delete Supplier
```
DELETE /admin/suppliers/:id
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Supplier deleted successfully"
}
```

**الاستخدام في الفرونت:**
- `components/UserManagement.tsx` - حذف supplier

---

### 9. Admin Ratings Endpoints

#### List Ratings (Admin)
```
GET /admin/ratings
```
**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): "pending_review" | "approved" | "rejected" | "flagged" | "all"
- `page` (optional): number
- `per_page` (optional): number

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "businessName": "Metro Electronics",
      "customerName": "Customer Name",
      "rating": 5,
      "reviewText": "Excellent service",
      "submissionDate": "2024-01-20T10:00:00Z",
      "status": "pending_review",
      "flagged": false,
      "reviewer": null
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 25
  }
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - عرض التقييمات المعلقة

---

#### Approve Rating
```
POST /admin/ratings/:id/approve
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "approved",
  "message": "Rating approved successfully"
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - الموافقة على التقييم

---

#### Reject Rating
```
POST /admin/ratings/:id/reject
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "notes": "Contains inappropriate language"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "rejected",
  "message": "Rating rejected successfully"
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - رفض التقييم

---

#### Flag Rating
```
POST /admin/ratings/:id/flag
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "notes": "Flagging for manual review"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "flagged",
  "message": "Rating flagged successfully"
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - تمييز التقييم

---

#### Restore Rating Status
```
POST /admin/ratings/:id/restore
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "status": "pending_review"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "pending_review",
  "message": "Rating status restored successfully"
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - استعادة حالة التقييم

---

### 10. Admin Documents Endpoints

#### List Documents (Admin)
```
GET /admin/documents
```
**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): "pending_verification" | "verified" | "rejected" | "all"
- `page` (optional): number
- `per_page` (optional): number

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "businessName": "Metro Electronics",
      "ownerName": "Ahmed Al-Rashid",
      "documentType": "Commercial Registration",
      "crNumber": "CR-123456",
      "uploadDate": "2024-01-15T10:00:00Z",
      "issueDate": "2024-01-01",
      "expiryDate": "2025-01-01",
      "status": "pending_verification",
      "reviewer": null,
      "notes": null,
      "documentUrl": "https://example.com/documents/cr_123.pdf"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 30
  }
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - عرض المستندات المعلقة

---

#### Approve Document
```
POST /admin/documents/:id/approve
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "notes": "Verified successfully"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "verified",
  "message": "Document approved successfully"
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - الموافقة على المستند

---

#### Reject Document
```
POST /admin/documents/:id/reject
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "notes": "Document expired"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "rejected",
  "message": "Document rejected successfully"
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - رفض المستند

---

#### Request Resubmission
```
POST /admin/documents/:id/request-resubmission
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "notes": "Please upload a clearer copy"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "pending_verification",
  "message": "Resubmission requested successfully"
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - طلب إعادة رفع المستند

---

### 11. Admin Reports Endpoints

#### List Reports (Admin)
```
GET /admin/reports
```
**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): "pending" | "approved" | "dismissed" | "takedown" | "all"
- `page` (optional): number
- `per_page` (optional): number

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "business": "Metro Electronics",
      "type": "profile",
      "reportedBy": "Visitor Name",
      "reportDate": "2024-01-20T10:00:00Z",
      "reason": "Inaccurate info",
      "content": "Address needs update",
      "status": "pending"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 8
  }
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - عرض البلاغات

---

#### Approve Report
```
POST /admin/reports/:id/approve
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "notes": "Action taken"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "approved",
  "message": "Report approved successfully"
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - الموافقة على البلاغ

---

#### Dismiss Report
```
POST /admin/reports/:id/dismiss
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "notes": "No action required"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "dismissed",
  "message": "Report dismissed successfully"
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - رفض البلاغ

---

#### Takedown Report
```
POST /admin/reports/:id/takedown
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "notes": "Content removed"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "takedown",
  "message": "Content takedown completed successfully"
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - إزالة المحتوى

---

#### Update Report Status
```
POST /admin/reports/:id/status
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "status": "pending",
  "notes": "Reset status for further review"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "pending",
  "message": "Status updated successfully"
}
```

**الاستخدام في الفرونت:**
- `components/ContentManagement.tsx` - تحديث حالة البلاغ

---

### 12. Admin Profile Endpoints

#### Update Admin Profile
```
PUT /admin/profile
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Updated Admin Name"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Updated Admin Name",
  "message": "Profile updated successfully"
}
```

**الاستخدام في الفرونت:**
- `components/SystemSettings.tsx` - تحديث بيانات الـ admin

---

#### Upload Admin Profile Image
```
POST /admin/profile/image
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request (FormData):**
```
profile_image: [file]
```

**Response (200 OK):**
```json
{
  "profileImage": "https://example.com/uploads/admin_profile_123.jpg",
  "message": "Profile image uploaded successfully"
}
```

**الاستخدام في الفرونت:**
- `components/SystemSettings.tsx` - رفع صورة الـ admin

---

### 13. Super Admin Endpoints

#### List Admins
```
GET /admins
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin Name",
      "email": "admin@example.com",
      "role": "admin",
      "department": "IT",
      "job_role": "Manager",
      "status": "active",
      "createdAt": "2024-01-01T10:00:00Z",
      "lastLogin": "2024-01-20T15:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 10
  }
}
```

**الاستخدام في الفرونت:**
- `components/EmployeeManagement.tsx` - عرض قائمة الـ admins

---

#### Get Admin by ID
```
GET /admins/:id
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Admin Name",
  "email": "admin@example.com",
  "role": "admin",
  "department": "IT",
  "job_role": "Manager",
  "permissions": {
    "user_management_view": true,
    "user_management_edit": false
  },
  "status": "active",
  "createdAt": "2024-01-01T10:00:00Z"
}
```

**الاستخدام في الفرونت:**
- `components/EmployeeManagement.tsx` - عرض تفاصيل admin

---

#### Create Admin
```
POST /admins
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "New Admin",
  "email": "ahmed0a41468158@gmail.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "admin",
  "department": "IT",
  "job_role": "Manager",
  "permissions": {
    "user_management_view": true,
    "user_management_edit": false,
    "user_management_delete": false,
    "user_management_full": false,
    "content_management_view": false,
    "content_management_supervise": true,
    "content_management_delete": false,
    "analytics_view": true,
    "analytics_export": false,
    "reports_view": true,
    "reports_create": false,
    "system_manage": false,
    "system_settings": false,
    "system_backups": false,
    "support_manage": false
  }
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "New Admin",
  "email": "ahmed0a41468158@gmail.com",
  "message": "Admin created successfully"
}
```

**الاستخدام في الفرونت:**
- `components/EmployeeManagement.tsx` - إنشاء admin جديد

---

#### Update Admin
```
PUT /admins/:id
```
**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Updated Admin Name",
  "email": "a@gmail.com",
  "department": "HR",
  "job_role": "Senior Manager",
  "permissions": {
    "user_management_view": true,
    "user_management_edit": true
  }
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Updated Admin Name",
  "message": "Admin updated successfully"
}
```

**الاستخدام في الفرونت:**
- `components/EmployeeManagement.tsx` - تحديث بيانات admin

---

#### Delete Admin
```
DELETE /admins/:id
```
**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Admin deleted successfully"
}
```

**الاستخدام في الفرونت:**
- `components/EmployeeManagement.tsx` - حذف admin

---

#### Register Super Admin
```
POST /admins/register-super
```
**Headers:**
```
Authorization: Bearer {token} // Only required after the first super admin exists
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Super Admin",
  "email": "alilinkedin414@gmail.com",
  "password": "123456789",
  "password_confirmation": "123456789"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Super Admin",
  "email": "alilinkedin414@gmail.com",
  "role": "super_admin",
  "message": "Super admin created successfully"
}
```

**الاستخدام في الفرونت:**
- `components/EmployeeManagement.tsx` - إنشاء super admin

---

## 📊 ملخص Endpoints حسب الأولوية

### 🔴 عالية الأولوية (يجب إضافتها فوراً)
1. `GET /supplier/profile` - جلب بيانات الـ supplier
2. `GET /supplier/ratings` - جلب التقييمات
3. `GET /supplier/dashboard/analytics` - إحصائيات الـ dashboard
4. `GET /admin/profile` - جلب بيانات الـ admin
5. `GET /admin/dashboard/analytics` - إحصائيات الـ admin dashboard
6. `GET /public/businesses/:slug/reviews` - جلب التقييمات العامة

### 🟡 متوسطة الأولوية
1. `PATCH /supplier/profile` - تحديث جزئي للـ profile
2. `PATCH /branches/:id` - تحديث جزئي للـ branch
3. Query parameters محسنة لـ `GET /public/businesses` (search, filters)

### 🟢 منخفضة الأولوية
1. تحسينات على error handling structure
2. تحسينات على pagination structure

---

## 🔧 ملاحظات تقنية

### 1. Authentication
- جميع الـ endpoints المحمية تحتاج `Authorization: Bearer {token}` header
- الـ token يتم تخزينه في `localStorage` في الفرونت إند
- عند 401 error، يجب redirect إلى `/login`

### 2. Error Handling
جميع الـ endpoints يجب أن ترجع errors بنفس الـ structure:
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Error for field"]
  }
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
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

### 4. File Uploads
- الـ endpoints التي تقبل ملفات تستخدم `multipart/form-data`
- Max file size: 5MB (كما هو محدد في الفرونت)
- Allowed types: JPG, PNG, PDF

### 5. Date Formats
- جميع التواريخ في format: `ISO 8601` (e.g., `2024-01-20T10:00:00Z`)
- الـ dates في query parameters: `YYYY-MM-DD`

### 6. Time Formats
- الـ working hours في format: `HH:mm` (e.g., `09:00`, `17:00`)

---

## 📝 Checklist للباك إند Developer

### Endpoints يجب إضافتها:
- [ ] `GET /supplier/profile`
- [ ] `GET /supplier/ratings`
- [ ] `GET /supplier/dashboard/analytics`
- [ ] `GET /admin/profile`
- [ ] `GET /admin/dashboard/analytics`
- [ ] `GET /public/businesses/:slug/reviews`

### Endpoints يجب تعديلها:
- [ ] إضافة `PATCH /supplier/profile` أو تعديل `PUT` ليقبل partial updates
- [ ] إضافة `PATCH /branches/:id` أو تعديل `PUT` ليقبل partial updates
- [ ] تعديل `POST /supplier/inquiries/:id/reply` لإضافة `subject` (optional)

### Query Parameters يجب إضافتها:
- [ ] `GET /public/businesses` - إضافة query parameters للبحث والتصفية
- [ ] `GET /supplier/ratings` - إضافة query parameters للتصفية والـ pagination

### Improvements:
- [ ] توحيد error handling structure
- [ ] توحيد pagination structure
- [ ] إضافة validation للـ request bodies
- [ ] إضافة rate limiting
- [ ] إضافة API documentation (Swagger/OpenAPI)

---

## 🎯 ملاحظات نهائية

1. **الأولوية للفرونت إند:** كما طلبت، تم إعطاء الأولوية للفرونت إند. جميع الـ endpoints المطلوبة في الفرونت موجودة في هذا الملف.

2. **التوافق:** تم فحص جميع الـ components والـ pages في الفرونت إند لتحديد الـ endpoints المطلوبة.

3. **التوثيق:** كل endpoint يحتوي على:
   - Method و URL
   - Headers المطلوبة
   - Request body structure
   - Response structure
   - الاستخدام في الفرونت إند

4. **الاختبار:** بعد تنفيذ الـ endpoints، يجب اختبارها مع الفرونت إند للتأكد من التوافق الكامل.

---

---

## 📌 ملخص نهائي للباك إند Developer

### ✅ ما يجب فعله:

#### 1. إضافة Endpoints جديدة (6 endpoints):
```
1. GET /supplier/profile
2. GET /supplier/ratings
3. GET /supplier/dashboard/analytics
4. GET /admin/profile
5. GET /admin/dashboard/analytics
6. GET /public/businesses/:slug/reviews
```

#### 2. تعديل Endpoints موجودة (3 endpoints):
```
1. POST /supplier/inquiries/:id/reply - إضافة subject (optional)
2. PUT /supplier/profile - إضافة PATCH للـ partial updates
3. PUT /branches/:id - إضافة PATCH للـ partial updates
```

#### 3. تحسين Query Parameters:
```
1. GET /public/businesses - إضافة query parameters للبحث والتصفية
2. GET /supplier/ratings - إضافة query parameters للتصفية
```

### ❌ ما يجب حذفه:
**لا يوجد** - جميع الـ endpoints في Postman collection مطلوبة

### 🔧 ما يجب تعديله:
- تحسين response structure لبعض الـ endpoints (موجود في التوثيق)
- إضافة validation للـ request bodies
- توحيد error handling structure
- توحيد pagination structure

---

## 📚 ملفات مرجعية

1. **`BACKEND_API_SPECIFICATION.md`** (هذا الملف) - المواصفات الكاملة
2. **`FRONTEND_ENDPOINTS_MAPPING.md`** - ربط الفرونت بالباك إند
3. **`API_ENDPOINTS_ANALYSIS.md`** - التحليل الأولي
4. **`lib/api/config.ts`** - API configuration في الفرونت
5. **`lib/api/service.ts`** - API service في الفرونت

---

**تاريخ الإنشاء:** 2024-01-20  
**آخر تحديث:** 2024-01-20  
**الإصدار:** 1.0

