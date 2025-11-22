// services/api.ts
const API_BASE_URL = "http://localhost:8000";

export interface RegistrationData {
  businessName: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface RegistrationResponse {
  message: string;
  supplier: any;
}

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  userType: string;
  supplier: {
    id: number;
    slug: string;
    name: string;
    email: string;
    phone: string;
    profileImage: string;
    emailVerifiedAt: string;
    status: string;
    plan: string;
    profileCompletion: number;
    profile: any;
    branches: any[];
  };
  accessToken: string;
  tokenType: string;
}

export interface OtpResponse {
  message: string;
  success: boolean;
  supplier?: any;
  accessToken?: string;
  tokenType?: string;
}

export interface ProfileUpdateData {
  businessName?: string;
  businessType?: string;
  categories?: string[];
  productKeywords?: string[];
  whoDoYouServe?: string;
  serviceDistance?: number;
  services?: string[];
  website?: string;
  mainPhone?: string;
  additionalPhones?: Array<{
    number: string;
    name: string;
    type: string;
  }>;
  address?: string;
  location?: { lat: number; lng: number };
  description?: string;
  workingHours?: {
    [key: string]: {
      closed?: boolean;
      open?: string;
      close?: string;
    };
  };
  hasBranches?: boolean;
  branches?: Array<{
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    manager?: string;
    location?: { lat: number; lng: number };
    workingHours?: {
      [key: string]: {
        closed?: boolean;
        open?: string;
        close?: string;
      };
    };
    specialServices?: string[];
    isMainBranch?: boolean;
  }>;
  contactEmail?: string; // From verification/login
  contactPhone?: string; // From verification/login
  document?: File; // Include document in main request
}

export interface ProfileUpdateResponse {
  message: string;
  supplier: any;
}

export interface DocumentUploadResponse {
  message: string;
  data: any;
}

export interface ApiError {
  [key: string]: string[];
}

export class ValidationError extends Error {
  public errors: ApiError;

  constructor(message: string, errors: ApiError) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // ====== REQUEST WRAPPER ======
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Convert HeadersInit to Record<string, string>
    const optionsHeaders: Record<string, string> = {};
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          optionsHeaders[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          optionsHeaders[key] = value;
        });
      } else {
        Object.assign(optionsHeaders, options.headers);
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...optionsHeaders,
    };

    if (requiresAuth) {
      const token = localStorage.getItem("supplier_token");
      const tokenType = localStorage.getItem("token_type") || "Bearer";
      if (!token) throw new Error("No auth token found");
      headers["Authorization"] = `${tokenType} ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Enhanced logging for debugging
      console.error(`API Error ${response.status}:`, {
        url,
        method: options.method || "GET",
        errorData,
        headers,
      });

      if (response.status === 422) {
        const validationError = new ValidationError(
          "Validation failed",
          errorData.errors || errorData
        );
        // Log detailed validation errors
        console.error("Validation Errors:", validationError.errors);
        console.error("Error data:", errorData);
        // Log password validation specifically
        if (errorData.password) {
          console.error("Password validation errors:", errorData.password);
        }
        // Don't clone response here, it's already used in errorData
        console.error("Status:", response.status);
        console.error("Status text:", response.statusText);
        throw validationError;
      }

      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    return await response.json();
  }

  // ====== API METHODS ======
  async registerSupplier(
    data: RegistrationData
  ): Promise<RegistrationResponse> {
    return this.request("/api/supplier/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.accessToken) {
      localStorage.setItem("supplier_token", response.accessToken);
      localStorage.setItem("token_type", response.tokenType || "Bearer");
    }

    return response;
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem("supplier_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";

    if (!token) throw new Error("No auth token found");

    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${tokenType} ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Logout failed" }));
      throw new Error(error.message || "Logout failed");
    }

    // Clear localStorage after successful logout
    localStorage.removeItem("supplier_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("supplier_user");
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return this.request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return this.request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async sendOtp(data: SendOtpRequest): Promise<OtpResponse> {
    return this.request("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<OtpResponse> {
    const response = await this.request<OtpResponse>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.accessToken) {
      localStorage.setItem("supplier_token", response.accessToken);
      localStorage.setItem("token_type", response.tokenType || "Bearer");
    }

    return response;
  }

  async updateProfile(data: ProfileUpdateData): Promise<ProfileUpdateResponse> {
    return this.request(
      "/api/supplier/profile",
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      true
    ); // requiresAuth = true
  }

  async updateProfileWithFormData(formData: FormData): Promise<ProfileUpdateResponse> {
    const token = localStorage.getItem("supplier_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";

    if (!token) throw new Error("No auth token found");

    const response = await fetch(`${this.baseURL}/api/supplier/profile`, {
      method: "PATCH",
      headers: {
        Authorization: `${tokenType} ${token}`,
        // Don't set Content-Type for FormData - browser sets it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Enhanced logging for debugging
      console.error(`API Error ${response.status}:`, {
        url: `${this.baseURL}/api/supplier/profile`,
        method: "PATCH",
        errorData,
      });

      if (response.status === 422) {
        console.error("Validation Errors:", errorData.errors || errorData);
        throw new ValidationError(
          errorData.message || "Validation failed",
          errorData.errors || errorData
        );
      }

      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getProfile(): Promise<any> {
    return this.request(
      "/api/supplier/profile",
      {
        method: "GET",
      },
      true
    ); // requiresAuth = true
  }

  async uploadDocument(file: File): Promise<DocumentUploadResponse> {
    const token = localStorage.getItem("supplier_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";

    if (!token) throw new Error("No auth token found");

    const formData = new FormData();
    formData.append("document", file);

    const response = await fetch(`${this.baseURL}/api/supplier/documents`, {
      method: "POST",
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Document upload error:", errorData);
      throw new Error(errorData.message || "Failed to upload document");
    }

    return await response.json();
  }

  // ====== HELPERS ======
  isAuthenticated(): boolean {
    return !!localStorage.getItem("supplier_token");
  }
}

export const apiService = new ApiService();
