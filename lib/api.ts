// services/api.ts
import { DashboardResponse } from "../types/dashboard";
import {
  InquiryRequest,
  InquiryResponse as PublicInquiryResponse,
  BusinessRequest,
  BusinessRequestResponse,
} from "../types/inquiry";
import {
  LoginResponse,
  LoginRequest,
  CreateAdminRequest,
  UpdateAdminRequest,
  GetAdminsResponse,
  AdminActionResponse,
} from "../types/auth";
import {
  InboxResponse,
  SuppliersListResponse,
  UpdateSupplierRequest,
  SupplierActionResponse,
  GetSuppliersParams,
  CreateSupplierRequest,
  AdminInquiry,
  AdminInquiryListResponse,
} from "./types";
import { TopRatedSuppliersResponse } from "./types/topRatedSuppliers";
import { AdminDashboardResponse } from "./types/adminDashboard";
import { AnalyticsResponse } from "./types/analytics";
import {
  SystemSettings,
  SystemSettingsResponse,
  UpdateSystemSettingsRequest,
  UpdateSystemSettingsResponse,
} from "./types/systemSettings";
import { RatingsResponse, RatingActionResponse } from "./types/ratings";
import { DocumentsResponse, DocumentActionResponse } from "./types/documents";

// Import extracted interfaces
import { Review, Certification, Product, Service } from "./types/common";
import { PermissionsResponse } from "./types/permissions";
import {
  Phone,
  WorkingHour,
  SupplierProfileData,
  SupplierProfile,
  BusinessProfile,
} from "./types/supplier";
import {
  RegistrationData,
  RegistrationResponse,
  SendOtpRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  OtpResponse,
} from "./types/auth";
import {
  ProfileUpdateData,
  ProfileUpdateResponse,
  DocumentUploadResponse,
} from "./types/profile";
import { Business, BusinessListResponse } from "./types/business";
import { ApiError, ValidationError } from "./types/errors";
import {
  Inquiry,
  InquiryResponse as SupplierInquiryResponse,
  InquiryListResponse,
  ReadStatusResponse,
} from "./types/inquiries";

const API_BASE_URL = "http://localhost:8000";

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
      if (!token) {
        throw new Error("No auth token found");
      }
      headers["Authorization"] = `${tokenType} ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers,
      });

      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = {};
      }

      if (!response.ok) {
        if (response.status === 422) {
          const validationError = new ValidationError(
            "Validation failed",
            responseData.errors || responseData
          );
          throw validationError;
        }

        throw new Error(
          responseData.message || `HTTP error ${response.status}`
        );
      }

      return responseData;
    } catch (error) {
      throw error;
    }
  }

  // ====== SUPPLIER INQUIRIES ======
  async sendInquiry(data: {
    receiver_supplier_id: number;
    sender_name: string;
    company: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<SupplierInquiryResponse> {
    return this.request(
      "/api/supplier/supplier-inquiries",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async replyToInquiry(
    inquiryId: number,
    data: { message: string }
  ): Promise<SupplierInquiryResponse> {
    return this.request(
      `/api/supplier/supplier-inquiries/${inquiryId}/reply`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async markInquiryAsRead(inquiryId: number): Promise<ReadStatusResponse> {
    return this.request(
      `/api/supplier/supplier-inquiries/${inquiryId}/read`,
      {
        method: "POST",
      },
      true
    );
  }

  async getInquiry(inquiryId: number): Promise<{ data: Inquiry[] }> {
    return this.request(
      `/api/supplier/supplier-inquiries/${inquiryId}`,
      {
        method: "GET",
      },
      true
    );
  }

  async getAllInquiries(): Promise<InquiryListResponse> {
    return this.request(
      "/api/supplier/supplier-inquiries",
      {
        method: "GET",
      },
      true
    );
  }

  async createBusinessRequest(
    request: BusinessRequest
  ): Promise<BusinessRequestResponse> {
    return this.request(
      "/api/supplier/business-requests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      },
      true
    );
  }

  // ====== PUBLIC INQUIRIES ======
  async createInquiry(data: InquiryRequest): Promise<PublicInquiryResponse> {
    // Check if user is logged in and get token
    const token = localStorage.getItem("token");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = (await this.request(
      "/api/supplier/inquiries",
      {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      },
      false // doesn't require authentication
    )) as PublicInquiryResponse;

    return response;
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

  // ضيف الـ helper functions دول في أول ملف api.ts (بعد الـ imports)

  // Helper function to set cookies
  setCookie = (name: string, value: string, days: number = 1) => {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  };

  // Helper function to delete cookies
  deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
  };

  // =====================================
  // استبدل الـ login function بده:
  // =====================================
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.request<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.accessToken) {
        throw new Error("No access token received");
      }

      // Save to localStorage
      localStorage.setItem("supplier_token", response.accessToken);
      localStorage.setItem("token_type", response.tokenType || "Bearer");

      // Save to cookies (for middleware)
      this.setCookie("supplier_token", response.accessToken, 7);
      this.setCookie("token_type", response.tokenType || "Bearer", 7);

      // Handle user type
      if (response.userType === "supplier" && response.supplier) {
        localStorage.setItem("user_type", "supplier");
        localStorage.setItem(
          "supplier_user",
          JSON.stringify(response.supplier)
        );
        this.setCookie("user_type", "supplier", 7);
      } else if (response.userType === "admin" && response.admin) {
        localStorage.setItem("user_type", "admin");
        localStorage.setItem("admin_user", JSON.stringify(response.admin));
        this.setCookie("user_type", "admin", 7);
      } else if (response.userType === "super_admin" && response.super_admin) {
        localStorage.setItem("user_type", "admin");
        localStorage.setItem(
          "admin_user",
          JSON.stringify(response.super_admin)
        );
        this.setCookie("user_type", "admin", 7);
      }

      // Fetch and store permissions for admin users
      if (
        response.userType === "admin" ||
        response.userType === "super_admin"
      ) {
        try {
          const permissionsResponse = await this.getPermissions();
          localStorage.setItem(
            "admin_permissions",
            JSON.stringify(permissionsResponse.permissions)
          );
        } catch (error) {
          console.warn("Failed to fetch permissions:", error);
        }
      }

      return response;
    } catch (error: any) {
      // Handle specific error responses
      if (error.message) {
        // If the error message is already in the right format, pass it through
        if (
          error.message.includes("Too many login attempts") ||
          error.message.includes("max_attempts") ||
          error.message.includes("Invalid") ||
          error.message.includes("locked")
        ) {
          throw new Error(error.message);
        }
      }

      // For other errors, create a more user-friendly message
      if (error.status === 429) {
        throw new Error("Too many login attempts. Please try again later.");
      } else if (error.status === 401) {
        throw new Error("Invalid email or password. Please try again.");
      } else if (error.status === 423) {
        throw new Error(
          "Account temporarily locked due to security reasons. Please contact support."
        );
      }

      throw error;
    }
  }

  // =====================================
  // Get Admin Permissions
  // =====================================
  async getPermissions(): Promise<PermissionsResponse> {
    try {
      const response = await this.request<PermissionsResponse>(
        "/api/admin/permissions",
        {
          method: "GET",
        },
        true
      );
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  // =====================================
  // استبدل الـ logout function بده:
  // =====================================
  async logout(): Promise<void> {
    const token = localStorage.getItem("supplier_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";

    try {
      if (token) {
        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${tokenType} ${token}`,
          },
        });
      }
    } catch (error) {
      console.warn("⚠️ Logout request error:", error);
    } finally {
      // Always clear data
      localStorage.removeItem("supplier_token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("user_type");
      localStorage.removeItem("supplier_user");
      localStorage.removeItem("admin_user");

      this.deleteCookie("supplier_token");
      this.deleteCookie("token_type");
      this.deleteCookie("user_type");
    }
  }

  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<{ message: string }> {
    return this.request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<{ message: string }> {
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
      // Save to localStorage
      localStorage.setItem("supplier_token", response.accessToken);
      localStorage.setItem("token_type", response.tokenType || "Bearer");

      // Save to cookies (for middleware)
      this.setCookie("supplier_token", response.accessToken, 7);
      this.setCookie("token_type", response.tokenType || "Bearer", 7);

      // Handle user type and user data
      if (response.userType === "supplier" && response.supplier) {
        localStorage.setItem("user_type", "supplier");
        localStorage.setItem(
          "supplier_user",
          JSON.stringify(response.supplier)
        );
        this.setCookie("user_type", "supplier", 7);
      } else if (response.userType === "admin" && response.admin) {
        localStorage.setItem("user_type", "admin");
        localStorage.setItem("admin_user", JSON.stringify(response.admin));
        this.setCookie("user_type", "admin", 7);
      } else if (response.userType === "super_admin" && response.super_admin) {
        localStorage.setItem("user_type", "admin");
        localStorage.setItem(
          "admin_user",
          JSON.stringify(response.super_admin)
        );
        this.setCookie("user_type", "admin", 7);
      }
    }

    return response;
  }

  async getBusinesses(params?: {
    keyword?: string;
    categories?: string | string[];
    location?: string;
    businessType?: string;
    minRating?: number;
    serviceDistance?: number;
    targetCustomer?: string;
    isApproved?: boolean;
    isOpenNow?: boolean;
    sort?: "rating" | "distance" | "reviews" | "name";
    per_page?: number;
    page?: number;
    address?: string;
    category?: string; // Add category as a separate parameter
    ai?: string; // Add AI parameter for advanced filtering
  }): Promise<BusinessListResponse> {
    console.log(
      "getBusinesses called with params:",
      JSON.stringify(params, null, 2)
    );

    // Log each parameter separately for better readability
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        console.log(`Parameter - ${key}:`, value);
      });
    }

    const queryParams = new URLSearchParams();

    const options: RequestInit = { method: "GET" };

    // Check if user is authenticated
    const token = localStorage.getItem("supplier_token");
    if (token) {
      const tokenType = localStorage.getItem("token_type") || "Bearer";
      options.headers = {
        ...options.headers,
        Authorization: `${tokenType} ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
    }
    if (params) {
      // Handle category separately to prevent double encoding
      const { category, ...restParams } = params;

      if (category) {
        queryParams.append("category", category);
      }

      // Handle the rest of the parameters
      Object.entries(restParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(","));
          } else if (typeof value === "boolean") {
            queryParams.append(key, value ? "1" : "0");
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    return this.request<BusinessListResponse>(
      `/api/public/businesses?${queryParams.toString()}`,
      {
        method: "GET",
      },
      false // doesn't require auth
    );
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

  async updateProfileWithFormData(
    formData: FormData
  ): Promise<ProfileUpdateResponse> {
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

      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
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
    );
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

  async uploadProfileImage(
    file: File
  ): Promise<{ success: boolean; data: { url: string } }> {
    const formData = new FormData();
    formData.append("profile_image", file);

    // Create headers object
    const headers = new Headers();
    // Don't set Content-Type header, let the browser set it with the correct boundary

    // Get the auth token
    const token = localStorage.getItem("supplier_token");
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }

    try {
      const response = await fetch(
        `${this.baseURL}/api/supplier/profile/image`,
        {
          method: "POST",
          headers,
          body: formData,
          credentials: "include",
        }
      );

      // First, check if the response is OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload image");
      }

      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        // If parsing fails but the status is 200, consider it a success
        if (response.status === 200) {
          return { success: true, data: { url: "" } }; // Return default success response
        }
        throw new Error("Failed to parse server response");
      }

      // If we got here, the request was successful
      // The backend might be returning the URL directly or in a data object
      const imageUrl = responseData.url || responseData.data?.url || "";

      return {
        success: true,
        data: {
          url: imageUrl,
        },
      };
    } catch (error: unknown) {
      console.error("API Error:", error);

      // Handle different types of errors
      if (typeof error === "object" && error !== null) {
        // Handle Fetch API Response errors
        if (
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          error.response !== null
        ) {
          try {
            // @ts-ignore - We've already checked the type
            const errorData = await error.response.json().catch(() => ({}));
            throw new Error(errorData.message || "فشل في رفع الصورة");
          } catch (e) {
            // If we can't parse the error response
            throw new Error("فشل في معالجة استجابة الخادم");
          }
        }

        // Handle Error objects
        if (error instanceof Error) {
          throw new Error(
            error.message || "حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى."
          );
        }
      }

      // Default error
      throw new Error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    }
  }

  // ====== HELPERS ======
  isAuthenticated(): boolean {
    return !!localStorage.getItem("supplier_token");
  }

  /**
   * Fetches business profile for a specific supplier
   * @param id The supplier ID
   * @returns Promise with the supplier's business profile including products
   */
  /**
   * Fetches business profile for a specific supplier
   * @param id The supplier ID
   * @returns Promise with the supplier's business profile including products
   */
  async getBusinessProfile(id: string | number): Promise<BusinessProfile> {
    const headers = new Headers();
    const token = localStorage.getItem("supplier_token");

    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
      headers.append("Accept", "application/json");
    }

    try {
      const response = await fetch(
        `${this.baseURL}/api/suppliers/${id}/business`,
        {
          method: "GET",
          headers,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch business profile (${response.status})`
        );
      }

      const data = await response.json();

      // Check if data is null or undefined
      if (!data) {
        throw new Error("No data received from server");
      }
      // Validate essential properties exist
      if (!data.profile) {
        data.profile = {};
      }

      return data;
    } catch (error) {
      console.error("[API] Error fetching business profile:", error);
      throw error;
    }
  }

  async getSupplierProfile(id: string | number): Promise<SupplierProfile> {
    const headers = new Headers();
    const token = localStorage.getItem("supplier_token");

    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
      headers.append("Accept", "application/json");
    }

    try {
      const response = await fetch(`${this.baseURL}/api/suppliers/${id}`, {
        method: "GET",
        headers,
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to fetch supplier profile"
        );
      }
      const d = await response.json();
      return d;
    } catch (error) {
      console.error("Error fetching supplier profile:", error);
      throw error;
    }
  }

  async submitReview(
    supplierId: number,
    rating: number,
    comment: string
  ): Promise<{ message: string }> {
    const token = localStorage.getItem("supplier_token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${this.baseURL}/api/supplier/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        rated_supplier_id: supplierId,
        score: rating,
        comment: comment,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to submit review");
    }

    return response.json();
  }

  // Get business statistics
  async getStats(): Promise<BusinessStats> {
    return this.request<BusinessStats>("/api/public/stats");
  }

  /**
   * Fetches the profile picture URL for a user
   * @param userId The ID of the user
   * @returns Promise with the profile picture URL
   */
  async getProfilePicture(
    userId: string | number
  ): Promise<{ profile_image: string }> {
    return this.request<{ profile_image: string }>(
      `/api/auth/profile/picture/${userId}`,
      {
        method: "GET",
      }
    );
  }

  /**
   * Changes the user's password
   * @param currentPassword The user's current password
   * @param newPassword The new password
   * @param confirmPassword The new password confirmation
   * @returns Promise with success message
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      "/api/auth/change-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      },
      true // requires authentication
    );
  }

  // ====== PREFERENCES ======
  async getPreferences(): Promise<any> {
    return this.request(
      "/api/supplier/preferences",
      {
        method: "GET",
      },
      true
    );
  }

  async updatePreferences(preferences: any): Promise<any> {
    return this.request(
      "/api/supplier/preferences",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      },
      true
    );
  }

  // ====== PRODUCT IMAGES ======
  async uploadProductImage(formData: FormData): Promise<any> {
    const token = localStorage.getItem("supplier_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";

    if (!token) throw new Error("No auth token found");

    const response = await fetch(
      `${this.baseURL}/api/supplier/product-images`,
      {
        method: "POST",
        headers: {
          Authorization: `${tokenType} ${token}`,
          // Don't set Content-Type for FormData - browser sets it with boundary
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  async deleteProductImage(imageId: number): Promise<any> {
    const token = localStorage.getItem("supplier_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";

    if (!token) throw new Error("No auth token found");

    const response = await fetch(
      `${this.baseURL}/api/supplier/product-images/${imageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    // Return success for DELETE operations
    return { success: true, message: "Image deleted successfully" };
  }

  // ====== SUPPLIER MANAGEMENT ======
  async getSuppliers(
    params?: GetSuppliersParams
  ): Promise<SuppliersListResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "all") {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request<SuppliersListResponse>(
      `/api/admin/suppliers?${queryParams.toString()}`,
      {
        method: "GET",
      },
      true
    );
  }

  async updateSupplier(
    supplierId: number,
    data: UpdateSupplierRequest
  ): Promise<SupplierActionResponse> {
    return this.request<SupplierActionResponse>(
      `/api/admin/suppliers/${supplierId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async deleteSupplier(supplierId: number): Promise<SupplierActionResponse> {
    return this.request<SupplierActionResponse>(
      `/api/admin/suppliers/${supplierId}`,
      {
        method: "DELETE",
      },
      true
    );
  }

  async createSupplier(
    data: CreateSupplierRequest
  ): Promise<SupplierActionResponse> {
    return this.request<SupplierActionResponse>(
      "/api/admin/suppliers",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async exportSuppliers(params?: GetSuppliersParams): Promise<void> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "all") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const token = localStorage.getItem("supplier_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";

    if (!token) throw new Error("No auth token found");

    const response = await fetch(
      `${this.baseURL}/api/admin/suppliers/export?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "suppliers.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  async deleteAccount(): Promise<any> {
    const token = localStorage.getItem("supplier_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";

    if (!token) throw new Error("No auth token found");

    const response = await fetch(`${this.baseURL}/api/supplier/account`, {
      method: "DELETE",
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    // Return success for DELETE operations
    return { success: true, message: "Account deleted successfully" };
  }

  // ====== DASHBOARD ======
  async getDashboard(range: string = "30"): Promise<DashboardResponse> {
    return this.request<DashboardResponse>(
      `/api/supplier/dashboard?range=${range}`,
      {
        method: "GET",
      },
      true // requiresAuth = true to send token
    );
  }

  // ====== ANALYTICS ======
  async trackView(data: {
    supplier_id: number;
    location: string;
    customer_type: string;
    duration: number;
    session_id: string;
  }): Promise<any> {
    return this.request(
      "/api/supplier/analytics/track-view",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      true
    );
  }

  async trackSearch(data: {
    keyword: string;
    search_type: string;
    location: string;
  }): Promise<any> {
    return this.request(
      "/api/supplier/analytics/track-search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      true
    );
  }

  // Performance Metrics
  async getPerformanceMetrics(): Promise<{
    metrics: Array<{
      metric: string;
      value: number;
      target: number;
      color: string;
      unit: string;
      isRating?: boolean;
    }>;
    overallScore: number;
  }> {
    return this.request(
      "/api/supplier/analytics/performance",
      { method: "GET" },
      true
    );
  }

  // Charts Data
  async getChartsData(
    range: number = 30,
    type: "views" | "contacts" | "inquiries"
  ): Promise<{
    type: string;
    range: number;
    data: number[];
    labels: string[];
  }> {
    return this.request(
      `/api/supplier/analytics/charts?range=${range}&type=${type}`,
      { method: "GET" },
      true
    );
  }

  // Keywords Analytics
  async getKeywordsAnalytics(range: number = 30): Promise<{
    keywords: Array<{
      keyword: string;
      searches: number;
      change: number;
      contacts: number;
      last_searched: string;
    }>;
    totalSearches: number;
    averageChange: number;
    period: string;
  }> {
    return this.request(
      `/api/supplier/analytics/keywords?range=${range}`,
      { method: "GET" },
      true
    );
  }

  // Customer Insights
  async getCustomerInsights(range: number = 30): Promise<{
    demographics: Array<{
      type: string;
      percentage: number;
      count: number;
    }>;
    topLocations: Array<{
      city: string;
      visitors: number;
      percentage: number;
    }>;
    totalVisitors: number;
    totalCustomers: number;
    period: string;
  }> {
    return this.request(
      `/api/supplier/analytics/insights?range=${range}`,
      { method: "GET" },
      true
    );
  }

  // Recommendations
  async getRecommendations(): Promise<{
    recommendations: string[];
    priority: "low" | "medium" | "high";
    generated_at: string;
    based_on: {
      profile_completion: number;
      response_rate: number;
      customer_satisfaction: number;
      search_visibility: number;
      total_inquiries: number;
      total_ratings: number;
      profile_views: number;
    };
  }> {
    return this.request(
      "/api/supplier/analytics/recommendations",
      { method: "GET" },
      true
    );
  }

  // ====== MESSAGING ======
  async getInbox(): Promise<InboxResponse> {
    return this.request(
      "/api/supplier/inbox",
      {
        method: "GET",
      },
      true
    );
  }

  async sendMessage(data: {
    receiver_email: string;
    subject: string;
    message: string;
  }): Promise<{ message: string }> {
    return this.request(
      "/api/supplier/messages",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async markAsRead(data: {
    type:
      | "supplier_inquiry"
      | "supplier_to_supplier_inquiry"
      | "message"
      | "supplier_rating";
    id: number;
  }): Promise<{ message: string }> {
    return this.request(
      "/api/supplier/inbox/mark-read",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async markAsReadForAdmin(inquiryId: number): Promise<{ message: string }> {
    return this.request(
      `/api/admin/inquiries/${inquiryId}/read`,
      {
        method: "POST",
      },
      true
    );
  }

  async replyToInquiryAdmin(data: {
    id: number;
    message: string;
  }): Promise<{ message: string }> {
    return this.request(
      "/api/admin/inquiries/reply",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  async replyToInboxItem(data: {
    type:
      | "message"
      | "supplier_to_supplier_inquiry"
      | "supplier_inquiry"
      | "supplier_rating"
      | "message";
    id: number;
    reply: string;
  }): Promise<{ message: string }> {
    return this.request(
      "/api/supplier/inbox/reply",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true
    );
  }

  // Export Analytics
  async exportAnalytics(format = "csv") {
    if (format === "csv") {
      return this.downloadAnalyticsCSV();
    } else {
      return this.request(
        `/api/supplier/analytics/export?format=${format}`,
        { method: "GET" },
        true
      );
    }
  }
  async downloadAnalyticsCSV() {
    const token = localStorage.getItem("supplier_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";

    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(
      `${this.baseURL}/api/supplier/analytics/export?format=csv`,
      {
        method: "GET",
        headers: {
          Authorization: `${tokenType} ${token}`,
          Accept: "text/csv",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to download CSV");
    }

    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "analytics_export.csv";
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true, filename };
  }
  // ====== ADMIN MANAGEMENT ======

  async createAdmin(
    adminData: CreateAdminRequest
  ): Promise<AdminActionResponse> {
    return this.request(
      "/api/admins",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      },
      true
    );
  }

  async getAdmins(): Promise<GetAdminsResponse> {
    return this.request(
      "/api/admins",
      {
        method: "GET",
      },
      true
    );
  }

  async updateAdmin(
    id: number,
    adminData: UpdateAdminRequest
  ): Promise<AdminActionResponse> {
    return this.request(
      `/api/admins/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      },
      true
    );
  }

  async deleteAdmin(id: number): Promise<AdminActionResponse> {
    return this.request(
      `/api/admins/${id}`,
      {
        method: "DELETE",
      },
      true
    );
  }

  // Get top-rated suppliers
  async getTopRatedSuppliers(): Promise<TopRatedSuppliersResponse> {
    return this.request<TopRatedSuppliersResponse>(
      "/api/suppliers/top-rated",
      {
        method: "GET",
      },
      false // No auth required
    );
  }

  // Get admin dashboard data
  async getAdminDashboard(range?: number): Promise<AdminDashboardResponse> {
    const queryParams = range ? `?range=${range}` : "";
    return this.request<AdminDashboardResponse>(
      `/api/admin/dashboard${queryParams}`,
      {
        method: "GET",
      },
      true // Requires authentication
    );
  }

  // Get analytics data
  async getAnalytics(range?: number): Promise<AnalyticsResponse> {
    const queryParams = range ? `?range=${range}` : "";
    return this.request<AnalyticsResponse>(
      `/api/admin/dashboard/analytics/v2${queryParams}`,
      {
        method: "GET",
      },
      true // Requires authentication
    );
  }

  async exportAdminAnalytics(range?: number): Promise<void> {
    const queryParams = new URLSearchParams();

    if (range) {
      queryParams.append("range", range.toString());
    }

    const token = localStorage.getItem("supplier_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";

    if (!token) throw new Error("No auth token found");

    const response = await fetch(
      `${
        this.baseURL
      }/api/admin/dashboard/analytics/export?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Get system settings
  async getSystemSettings(): Promise<SystemSettingsResponse> {
    return this.request<SystemSettingsResponse>(
      "/api/admin/system/settings",
      {
        method: "GET",
      },
      true // Requires authentication
    );
  }

  // Update system settings
  async updateSystemSettings(
    settings: UpdateSystemSettingsRequest
  ): Promise<UpdateSystemSettingsResponse> {
    return this.request<UpdateSystemSettingsResponse>(
      "/api/admin/system/settings",
      {
        method: "PUT",
        body: JSON.stringify(settings),
      },
      true // Requires authentication
    );
  }

  // Restore system settings to default
  async restoreSystemSettings(): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request<{ success: boolean; message: string }>(
      "/api/admin/system/settings/restore",
      {
        method: "POST",
      },
      true // Requires authentication
    );
  }

  // Create system backup
  async createSystemBackup(): Promise<{
    success: boolean;
    message: string;
    backup?: {
      filename: string;
      path: string;
      size: number;
      created_at: string;
      size_formatted: string;
    };
  }> {
    return this.request<{
      success: boolean;
      message: string;
      backup?: {
        filename: string;
        path: string;
        size: number;
        created_at: string;
        size_formatted: string;
      };
    }>(
      "/api/admin/system/backup",
      {
        method: "POST",
      },
      true // Requires authentication
    );
  }

  // Get maintenance status (no authentication required)
  async getMaintenanceStatus(): Promise<{
    success: boolean;
    maintenance_mode: boolean;
  }> {
    try {
      const response = await fetch(`${this.baseURL}/api/maintenance/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching maintenance status:", error);
      // Return default values on error
      return { success: false, maintenance_mode: false };
    }
  }

  // =====================================
  // Ratings API
  // =====================================
  async getRatings(
    status: string = "all",
    page: number = 1,
    perPage: number = 15
  ): Promise<RatingsResponse> {
    const params = new URLSearchParams({
      status,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    return this.request<RatingsResponse>(
      `/api/admin/ratings?${params.toString()}`,
      {
        method: "GET",
      },
      true // Requires authentication
    );
  }

  async approveRating(ratingId: number): Promise<RatingActionResponse> {
    return this.request<RatingActionResponse>(
      `/api/admin/ratings/${ratingId}/approve`,
      {
        method: "POST",
      },
      true // Requires authentication
    );
  }

  async rejectRating(ratingId: number): Promise<RatingActionResponse> {
    return this.request<RatingActionResponse>(
      `/api/admin/ratings/${ratingId}/reject`,
      {
        method: "POST",
      },
      true // Requires authentication
    );
  }

  async flagRating(ratingId: number): Promise<RatingActionResponse> {
    return this.request<RatingActionResponse>(
      `/api/admin/ratings/${ratingId}/flag`,
      {
        method: "POST",
      },
      true // Requires authentication
    );
  }

  // =====================================
  // Documents API
  // =====================================
  async getDocuments(
    status: string = "all",
    page: number = 1,
    perPage: number = 15
  ): Promise<DocumentsResponse> {
    const params = new URLSearchParams({
      status,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    return this.request<DocumentsResponse>(
      `/api/admin/documents?${params.toString()}`,
      {
        method: "GET",
      },
      true // Requires authentication
    );
  }

  async approveDocument(documentId: number): Promise<DocumentActionResponse> {
    return this.request<DocumentActionResponse>(
      `/api/admin/documents/${documentId}/approve`,
      {
        method: "POST",
      },
      true // Requires authentication
    );
  }

  async rejectDocument(
    documentId: number,
    reason?: string
  ): Promise<DocumentActionResponse> {
    return this.request<DocumentActionResponse>(
      `/api/admin/documents/${documentId}/reject`,
      {
        method: "POST",
        body: JSON.stringify({ reason }),
      },
      true // Requires authentication
    );
  }

  async getApprovedToday(): Promise<{ approvedToday: number }> {
    return this.request<{ approvedToday: number }>(
      "/api/admin/content/approved-today",
      {
        method: "GET",
      },
      true // Requires authentication
    );
  }

  // =====================================
  // Admin Inquiries API
  // =====================================
  async getInquiries(isRead?: boolean): Promise<AdminInquiryListResponse> {
    const params = new URLSearchParams();

    if (isRead !== undefined) {
      params.append("isread", isRead.toString());
    }

    const queryString = params.toString();
    const url = `/api/admin/inquiries/list${
      queryString ? "?" + queryString : ""
    }`;

    return this.request<AdminInquiryListResponse>(
      url,
      {
        method: "GET",
      },
      true // Requires authentication
    );
  }
}

// Interface for business statistics
interface BusinessStats {
  total_businesses: number;
  total_suppliers: number;
  open_now: number;
  new_this_week: number;
}

// Re-export interfaces for backward compatibility
export type { Review, Certification, Product, Service } from "./types/common";
export type { PermissionsResponse } from "./types/permissions";
export type {
  Phone,
  WorkingHour,
  SupplierProfileData,
  SupplierProfile,
  BusinessProfile,
} from "./types/supplier";
export type {
  RegistrationData,
  RegistrationResponse,
  SendOtpRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  OtpResponse,
} from "./types/auth";
export type {
  ProfileUpdateData,
  ProfileUpdateResponse,
  DocumentUploadResponse,
} from "./types/profile";
export type { Business, BusinessListResponse } from "./types/business";
export type { ApiError } from "./types/errors";
export { ValidationError } from "./types/errors";
export type {
  Inquiry,
  InquiryResponse,
  InquiryListResponse,
  ReadStatusResponse,
} from "./types/inquiries";

export const apiService = new ApiService();
