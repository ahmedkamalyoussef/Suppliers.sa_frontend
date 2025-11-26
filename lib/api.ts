// services/api.ts
const API_BASE_URL = "http://localhost:8000";

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    name: string;
    avatar?: string;
  };
}

export interface Certification {
  id: number;
  certification_name: string;
}

export interface Product {
  id: number;
  product_name: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  service_name: string;
}

export interface Phone {
  id: number;
  type: string;
  number: string;
  name: string;
}

export interface WorkingHour {
  open: string;
  close: string;
  closed: boolean;
}

export interface SupplierProfileData {
  business_type: string;
  category: string;
  business_image: string;
  website: string;
  contact_email: string;
  description: string | null;
  service_distance: string;
  target_market: string[];
  main_phone: string;
  additional_phones: Phone[];
  business_address: string;
  latitude: string;
  longitude: string;
  working_hours: Record<string, WorkingHour>;
  services_offered: string[];
  products?: Product[];
}

export interface SupplierProfile {
  id: number;
  name: string;
  status: string;
  profile: SupplierProfileData;
  profile_image: string;
  ratings: {
    average: number | null;
    count: number;
    reviews: Review[];
  };
  certifications: Certification[];
  product_images: Array<{
    id: number;
    image_url: string;
    name: string;
  }>;
  services: Service[];
}

// BusinessProfile extends SupplierProfile with explicit products in profile
export interface BusinessProfile extends Omit<SupplierProfile, "profile"> {
  profile: SupplierProfileData & {
    products: Product[]; // Company products inside profile
  };
}

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
  category?: string;
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

export interface Business {
  id: number;
  name: string;
  businessImage: string;
  slug: string;
  category: string;
  categories: string[];
  targetMarket: string[];
  services: string[];
  businessType: string;
  address: string;
  serviceDistance: number;
  rating?: number;
  reviewsCount: number;
  status: string;
  plan: string;
  latitude: string;
  longitude: string;
  mainPhone: string;
  contactEmail: string;
}

export interface BusinessListResponse {
  data: Business[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
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
    console.log(`[API] Preparing request to: ${url}`, { method: options.method || 'GET' });

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
      console.log('[API] Auth check - Token exists:', !!token);
      if (!token) {
        console.error('[API] No auth token found in localStorage');
        throw new Error("No auth token found");
      }
      headers["Authorization"] = `${tokenType} ${token}`;
    }

    console.log('[API] Request headers:', headers);
    if (options.body) {
      console.log('[API] Request body:', options.body);
    }

    try {
      console.log('[API] Sending request...');
      const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers,
      });

      console.log(`[API] Received response: ${response.status} ${response.statusText}`);
      
      // Clone the response to read it as text first (for logging)
      const responseClone = response.clone();
      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
        console.log('[API] Response data:', responseData);
      } catch (e) {
        console.log('[API] Non-JSON response:', responseText);
        responseData = {};
      }

      if (!response.ok) {
        console.error(`[API] Request failed with status ${response.status}:`, {
          url,
          status: response.status,
          statusText: response.statusText,
          response: responseData,
        });

        if (response.status === 422) {
          const validationError = new ValidationError(
            "Validation failed",
            responseData.errors || responseData
          );
          console.error('[API] Validation Errors:', validationError.errors);
          throw validationError;
        }

        throw new Error(responseData.message || `HTTP error ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('[API] Request failed:', error);
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
  }): Promise<InquiryResponse> {
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
  ): Promise<InquiryResponse> {
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
      const error = await response
        .json()
        .catch(() => ({ message: "Logout failed" }));
      throw new Error(error.message || "Logout failed");
    }

    // Clear localStorage after successful logout
    localStorage.removeItem("supplier_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("supplier_user");
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
      localStorage.setItem("supplier_token", response.accessToken);
      localStorage.setItem("token_type", response.tokenType || "Bearer");
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
  }): Promise<BusinessListResponse> {
    const queryParams = new URLSearchParams();

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
          errorData.message || "Failed to fetch business profile"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching business profile:", error);
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

      return await response.json();
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
  async getProfilePicture(userId: string | number): Promise<{ profile_image: string }> {
    return this.request<{ profile_image: string }>(
      `/api/auth/profile/picture/${userId}`,
      {
        method: 'GET',
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
      '/api/auth/change-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
}

// Supplier Inquiry Interfaces
export interface Inquiry {
  id: number;
  subject: string;
  message: string;
  email: string;
  phone: string;
  company: string | null;
  sender: {
    id: number;
    name: string;
  };
  receiver: {
    id: number;
    name: string;
  };
  is_read: boolean;
  type: "inquiry" | "reply";
  created_at: string;
  time_ago: string;
  is_reply: boolean;
}

export interface InquiryResponse {
  message: string;
  data: Inquiry;
}

export interface InquiryListResponse {
  data: Inquiry[];
}

export interface ReadStatusResponse {
  success: boolean;
  message: string;
}

// Interface for business statistics
interface BusinessStats {
  total_businesses: number;
  total_suppliers: number;
  open_now: number;
  new_this_week: number;
}

export const apiService = new ApiService();
