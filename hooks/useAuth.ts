"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  department: string | null;
  jobRole: string | null;
  profileImage: string | null;
  permissions?: any;
}

export interface SupplierUser {
  id: number;
  slug: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  status: string;
  plan: string;
  profileCompletion: number;
}

export type User = SupplierUser | AdminUser;

export interface AuthState {
  isAuthenticated: boolean;
  userType: "supplier" | "admin" | "super_admin" | null;
  user: User | null;
  loading: boolean;
}

export interface UseAuthReturn extends AuthState {
  login: (user: User, token: string, tokenType?: string) => void;
  logout: () => void;
  refreshAuth: () => void;
}

// Helper function to set cookies
const setCookie = (name: string, value: string, days: number = 7) => {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
};

// Helper function to delete cookies
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    user: null,
    loading: true,
  });

  const router = useRouter();

  const checkAuth = () => {
    try {
      const token = localStorage.getItem("supplier_token");
      const userType = localStorage.getItem("user_type");

      if (!token) {
        setAuthState({
          isAuthenticated: false,
          userType: null,
          user: null,
          loading: false,
        });
        return;
      }

      // Handle supplier
      if (userType === "supplier") {
        const supplierUserStr = localStorage.getItem("supplier_user");
        if (supplierUserStr) {
          try {
            const supplierUser: SupplierUser = JSON.parse(supplierUserStr);
            setAuthState({
              isAuthenticated: true,
              userType: "supplier",
              user: supplierUser,
              loading: false,
            });
            return;
          } catch (error) {
            console.error("Error parsing supplier user:", error);
          }
        }
      }

      // Handle admin/super_admin
      if (userType === "admin") {
        const adminUserStr = localStorage.getItem("admin_user");
        if (adminUserStr) {
          try {
            const adminUser: AdminUser = JSON.parse(adminUserStr);
            setAuthState({
              isAuthenticated: true,
              userType:
                adminUser.role === "super_admin" ? "super_admin" : "admin",
              user: adminUser,
              loading: false,
            });
            return;
          } catch (error) {
            console.error("Error parsing admin user:", error);
          }
        }
      }

      // If we have token but no valid user data, clear everything
      console.warn(
        "⚠️ Token exists but no valid user data found, clearing auth"
      );
      logout();
    } catch (error) {
      console.error("Error checking auth:", error);
      setAuthState({
        isAuthenticated: false,
        userType: null,
        user: null,
        loading: false,
      });
    }
  };

  const login = (user: User, token: string, tokenType: string = "Bearer") => {
    try {
      // Save token
      localStorage.setItem("supplier_token", token);
      localStorage.setItem("token_type", tokenType);
      setCookie("supplier_token", token, 7);
      setCookie("token_type", tokenType, 7);

      // Determine user type
      const isAdminUser = (user as AdminUser).role !== undefined;

      if (isAdminUser) {
        const adminUser = user as AdminUser;
        const userType =
          adminUser.role === "super_admin" ? "super_admin" : "admin";

        localStorage.setItem("user_type", "admin"); // Always store as "admin" for middleware
        localStorage.setItem("admin_user", JSON.stringify(adminUser));
        setCookie("user_type", "admin", 7);

        setAuthState({
          isAuthenticated: true,
          userType: userType,
          user: adminUser,
          loading: false,
        });

        console.log(`✅ ${userType} logged in via hook:`, adminUser.email);
      } else {
        const supplierUser = user as SupplierUser;

        localStorage.setItem("user_type", "supplier");
        localStorage.setItem("supplier_user", JSON.stringify(supplierUser));
        setCookie("user_type", "supplier", 7);

        setAuthState({
          isAuthenticated: true,
          userType: "supplier",
          user: supplierUser,
          loading: false,
        });

        console.log("✅ Supplier logged in via hook:", supplierUser.email);
      }
    } catch (error) {
      console.error("Error in login:", error);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("supplier_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user_type");
    localStorage.removeItem("supplier_user");
    localStorage.removeItem("admin_user");

    // Clear cookies
    deleteCookie("supplier_token");
    deleteCookie("token_type");
    deleteCookie("user_type");

    setAuthState({
      isAuthenticated: false,
      userType: null,
      user: null,
      loading: false,
    });

    console.log("✅ User logged out");

    // Redirect to login
    router.push("/login");
  };

  const refreshAuth = () => {
    checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    ...authState,
    login,
    logout,
    refreshAuth,
  };
};
