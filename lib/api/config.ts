/**
 * API Configuration
 * This file contains all API endpoints from the Postman collection
 */

export const API_CONFIG = {
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",

  // Auth endpoints
  auth: {
    login: "/auth/login",
    sendOtp: "/auth/send-otp",
    verifyOtp: "/auth/verify-otp",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    logout: "/auth/logout",
    changePassword: "/auth/change-password",
  },

  // Public endpoints
  public: {
    listBusinesses: "/public/businesses",
    businessDetails: "/public/businesses/:slug",
    businessReviews: "/public/businesses/:slug/reviews",
    submitReview: "/public/businesses/:slug/reviews",
    submitInquiry: "/public/businesses/:slug/inquiries",
    submitContentReport: "/public/reports",
  },

  // Registration endpoints
  registration: {
    supplierRegister: "/supplier/register",
    registerSuperAdmin: "/admins/register-super",
  },

  // Supplier endpoints
  supplier: {
    dashboard: "/supplier/dashboard",
    dashboardAnalytics: "/supplier/dashboard/analytics",
    profile: {
      get: "/supplier/profile",
      update: "/supplier/profile",
      uploadImage: "/supplier/profile/image",
    },
    ratings: {
      list: "/supplier/ratings",
      submit: "/supplier/ratings",
    },
    documents: {
      list: "/supplier/documents",
      upload: "/supplier/documents",
      delete: "/supplier/documents/:id",
      resubmit: "/supplier/documents/:id/resubmit",
    },
    reports: {
      list: "/supplier/reports",
      create: "/supplier/reports",
    },
    inquiries: {
      list: "/supplier/inquiries",
      get: "/supplier/inquiries/:id",
      reply: "/supplier/inquiries/:id/reply",
      markRead: "/supplier/inquiries/:id/mark-read",
      updateStatus: "/supplier/inquiries/:id/status",
    },
  },

  // Branches endpoints
  branches: {
    list: "/branches",
    getById: "/branches/:id",
    create: "/branches",
    update: "/branches/:id",
    delete: "/branches/:id",
    setMain: "/branches/:id/set-main",
  },

  // Admin endpoints
  admin: {
    dashboard: "/admin/dashboard",
    dashboardAnalytics: "/admin/dashboard/analytics",
    contentOverview: "/admin/content",
    profile: {
      get: "/admin/profile",
      update: "/admin/profile",
      uploadImage: "/admin/profile/image",
    },
    suppliers: {
      list: "/admin/suppliers",
      show: "/admin/suppliers/:id",
      update: "/admin/suppliers/:id",
      updateStatus: "/admin/suppliers/:id/status",
      delete: "/admin/suppliers/:id",
    },
    ratings: {
      list: "/admin/ratings",
      get: "/admin/ratings/:id",
      approve: "/admin/ratings/:id/approve",
      reject: "/admin/ratings/:id/reject",
      flag: "/admin/ratings/:id/flag",
      restore: "/admin/ratings/:id/restore",
    },
    documents: {
      list: "/admin/documents",
      get: "/admin/documents/:id",
      approve: "/admin/documents/:id/approve",
      reject: "/admin/documents/:id/reject",
      requestResubmission: "/admin/documents/:id/request-resubmission",
    },
    reports: {
      list: "/admin/reports",
      get: "/admin/reports/:id",
      approve: "/admin/reports/:id/approve",
      dismiss: "/admin/reports/:id/dismiss",
      takedown: "/admin/reports/:id/takedown",
      updateStatus: "/admin/reports/:id/status",
    },
  },

  // Super Admin endpoints
  superAdmin: {
    admins: {
      list: "/admins",
      getById: "/admins/:id",
      create: "/admins",
      update: "/admins/:id",
      delete: "/admins/:id",
    },
  },
} as const;

/**
 * Helper function to build full URL
 */
export function buildUrl(endpoint: string, params?: Record<string, string | number>): string {
  let url = endpoint;
  
  // Replace path parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  
  return `${API_CONFIG.baseUrl}${url}`;
}

/**
 * Get authorization header
 */
export function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

