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
  supplier: {
    id: number;
    slug: string;
    name: string;
    email: string;
    phone: string;
    profileImage: string;
    status: string;
    plan: string;
    profileCompletion: number;
    profile: {
      slug: string;
      businessName: string;
      mainPhone: string;
      contactEmail: string;
    };
  };
}

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface OtpResponse {
  message: string;
  success: boolean;
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

  // =============== GET CSRF TOKEN ===================
  private async getCSRFToken(): Promise<string | null> {
    // Ask Laravel to send the XSRF-TOKEN cookie
    await fetch(`${this.baseURL}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });

    // Read it from cookies
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");

      if (name === "XSRF-TOKEN") {
        return decodeURIComponent(value);
      }
    }

    return null;
  }

  // =============== REQUEST WRAPPER ===================
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Add CSRF token for unsafe methods
    if (["POST", "PUT", "PATCH", "DELETE"].includes(options.method || "")) {
      const csrfToken = await this.getCSRFToken();
      if (csrfToken) {
        headers["X-XSRF-TOKEN"] = csrfToken;
      }
    }

    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // CSRF token error
      if (response.status === 419) {
        throw new Error("CSRF token error. Please refresh the page and try again.");
      }

      // Validation error
      if (response.status === 422) {
        throw new ValidationError("Validation failed", errorData.errors || errorData);
      }

      throw errorData;
    }

    return await response.json();
  }

  // =============== API Endpoints ===================

  async registerSupplier(data: RegistrationData): Promise<RegistrationResponse> {
    return this.request("/api/supplier/register", {
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
    console.log("Sending verify OTP request:", data);
    try {
      const response = await this.request("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify(data),
      });
      console.log("Verify OTP response:", response);
      return response as OtpResponse;
    } catch (error: any) {
      console.log("Verify OTP error:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
