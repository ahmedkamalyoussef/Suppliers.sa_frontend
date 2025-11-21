# API Integration Guide

## Configuration

### Base URL Configuration

The API base URL is configured in `lib/api/config.ts`. By default, it uses:
- **Local Development**: `http://localhost:8000/api`
- **Production**: Set via environment variable `NEXT_PUBLIC_API_BASE_URL`

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

For production, update this to your production API URL:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
```

## Usage

### Importing the API Service

```typescript
import { api, API_CONFIG } from "@/lib/api/service";
```

### Making API Calls

#### GET Request
```typescript
const response = await api.get<ResponseType>(
  API_CONFIG.supplier.dashboard,
  { params: { range: "30" } }
);
```

#### POST Request
```typescript
const response = await api.post<ResponseType>(
  API_CONFIG.auth.login,
  { email: "user@example.com", password: "password123" }
);
```

#### PUT/PATCH Request
```typescript
const response = await api.put<ResponseType>(
  API_CONFIG.supplier.profile.update,
  { businessName: "New Name" }
);
```

#### DELETE Request
```typescript
const response = await api.delete<ResponseType>(
  API_CONFIG.supplier.documents.delete.replace(":id", documentId)
);
```

#### File Upload
```typescript
const formData = new FormData();
formData.append("profile_image", file);

const response = await api.uploadFile<ResponseType>(
  API_CONFIG.supplier.profile.uploadImage,
  formData
);
```

### Authentication

The API service automatically handles authentication tokens:
- Tokens are stored in `localStorage` as `auth_token`
- Tokens are automatically added to request headers
- On 401 errors, the token is cleared and user is redirected to login

#### Setting Token After Login
```typescript
api.setToken(token);
```

## Endpoints Reference

All endpoints are defined in `lib/api/config.ts`. Key endpoints:

### Auth
- `API_CONFIG.auth.login` - POST `/auth/login`
- `API_CONFIG.auth.sendOtp` - POST `/auth/send-otp`
- `API_CONFIG.auth.verifyOtp` - POST `/auth/verify-otp`
- `API_CONFIG.auth.logout` - POST `/auth/logout`

### Supplier
- `API_CONFIG.supplier.dashboard` - GET `/supplier/dashboard`
- `API_CONFIG.supplier.profile.get` - GET `/supplier/profile`
- `API_CONFIG.supplier.profile.update` - PUT `/supplier/profile`
- `API_CONFIG.supplier.inquiries.list` - GET `/supplier/inquiries`

### Public
- `API_CONFIG.public.listBusinesses` - GET `/public/businesses`
- `API_CONFIG.public.businessDetails` - GET `/public/businesses/:slug`
- `API_CONFIG.public.submitReview` - POST `/public/businesses/:slug/reviews`

## Error Handling

The API service includes automatic error handling:
- 401 errors: Token cleared, redirect to login
- Other errors: Thrown as exceptions

Example error handling:
```typescript
try {
  const response = await api.get(API_CONFIG.supplier.dashboard);
  // Handle success
} catch (error: any) {
  const errorMessage = error.response?.data?.message || error.message;
  // Handle error
}
```

## Completed Integrations

✅ Authentication (Login/Register/OTP)
✅ Dashboard Stats
🔄 Business Management (In Progress)
🔄 Dashboard Analytics (Pending)
🔄 Messages/Inquiries (Pending)
🔄 Public Business Profile (Pending)
🔄 Admin Dashboard (Pending)
🔄 Branches Management (Pending)

