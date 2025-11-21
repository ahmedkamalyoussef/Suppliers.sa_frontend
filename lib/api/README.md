# API Service Documentation

## Overview
This directory contains the API service layer that connects the frontend to the backend endpoints defined in the Postman collection.

## Files

- `config.ts` - API endpoints configuration
- `service.ts` - Axios-based HTTP client service

## Setup

1. Add the API base URL to your `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com/api
```

2. Import and use the API service in your components:

```typescript
import { api } from '@/lib/api/service';
import { API_CONFIG } from '@/lib/api/config';

// Example: Login
const login = async (email: string, password: string) => {
  try {
    const response = await api.post(API_CONFIG.auth.login, {
      email,
      password,
    });
    
    // Save token
    if (response.token) {
      api.setToken(response.token);
    }
    
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Example: Get Supplier Profile
const getSupplierProfile = async () => {
  try {
    const response = await api.get(API_CONFIG.supplier.updateProfile);
    return response;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
};

// Example: Upload File
const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('profile_image', file);
  
  try {
    const response = await api.uploadFile(
      API_CONFIG.supplier.uploadProfileImage,
      formData
    );
    return response;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```

## Available Endpoints

All endpoints are defined in `config.ts`. Use `API_CONFIG` to access them:

- `API_CONFIG.auth.*` - Authentication endpoints
- `API_CONFIG.supplier.*` - Supplier endpoints
- `API_CONFIG.admin.*` - Admin endpoints
- `API_CONFIG.public.*` - Public endpoints
- `API_CONFIG.branches.*` - Branch management endpoints

## Authentication

The API service automatically:
- Adds the `Authorization: Bearer {token}` header to all requests
- Stores the token in `localStorage` when you call `api.setToken(token)`
- Redirects to `/login` on 401 errors

## Error Handling

The service includes automatic error handling:
- 401 errors: Clears token and redirects to login
- Other errors: Returns the error response for manual handling

## TypeScript Support

All API methods are fully typed. You can define response types:

```typescript
interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const response = await api.post<LoginResponse>(
  API_CONFIG.auth.login,
  { email, password }
);
```

