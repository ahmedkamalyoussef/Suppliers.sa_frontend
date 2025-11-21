/**
 * API Service
 * Centralized API service for making HTTP requests
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_CONFIG, buildUrl, getAuthHeaders } from "./config";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - clear token and redirect to login
          this.clearToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  private clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  // Generic request methods
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(endpoint, config);
    return response.data;
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post(endpoint, data, config);
    return response.data;
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put(endpoint, data, config);
    return response.data;
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch(endpoint, data, config);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(endpoint, config);
    return response.data;
  }

  // File upload helper
  async uploadFile<T>(
    endpoint: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post(endpoint, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export convenience methods
export const api = {
  get: <T>(endpoint: string, config?: AxiosRequestConfig) =>
    apiService.get<T>(endpoint, config),
  post: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
    apiService.post<T>(endpoint, data, config),
  put: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
    apiService.put<T>(endpoint, data, config),
  patch: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
    apiService.patch<T>(endpoint, data, config),
  delete: <T>(endpoint: string, config?: AxiosRequestConfig) =>
    apiService.delete<T>(endpoint, config),
  uploadFile: <T>(endpoint: string, formData: FormData, config?: AxiosRequestConfig) =>
    apiService.uploadFile<T>(endpoint, formData, config),
  setToken: (token: string) => apiService.setToken(token),
};

