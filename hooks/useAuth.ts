"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  department: string | null;
  jobRole: string | null;
  profileImage: string | null;
  permissions?: any;
  plan: string;
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
  role?: "supplier";
  department?: string | null;
  jobRole?: string | null;
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
  canAccessCurrentPage: (currentPath: string) => boolean;
  enforceAdminPageAccess: (currentPath: string) => boolean;
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
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = useCallback(async () => {
    if (authState.userType !== "supplier" || !authState.isAuthenticated) return;

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    try {
      // Get timeout from settings (cached or fetched)
      const settingsStr = localStorage.getItem("system_settings");
      let timeoutMinutes = 15; // Default to 15 minutes

      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        timeoutMinutes = settings.session_timeout_minutes || 15;
      }

      console.log(`[Session Timeout] Timer reset: ${timeoutMinutes} minutes`);

      idleTimerRef.current = setTimeout(() => {
        console.log(`[Session Timeout] ${timeoutMinutes} minutes of inactivity - logging out`);
        localStorage.setItem("session_timeout_alert", "true");
        logout();
      }, timeoutMinutes * 60 * 1000);
    } catch (error) {
      console.error("Error setting idle timer:", error);
    }
  }, [authState.userType, authState.isAuthenticated]);

  useEffect(() => {
    if (authState.userType === "supplier" && authState.isAuthenticated) {
      const events = ["mousedown", "keydown", "touchstart", "scroll"];
      events.forEach((event) => window.addEventListener(event, resetIdleTimer));
      resetIdleTimer();

      return () => {
        events.forEach((event) => window.removeEventListener(event, resetIdleTimer));
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      };
    }
  }, [authState.userType, authState.isAuthenticated, resetIdleTimer]);

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
        const permissionsStr = localStorage.getItem("admin_permissions");

        if (adminUserStr) {
          try {
            const adminUserData: AdminUser = JSON.parse(adminUserStr);
            const permissions = permissionsStr
              ? JSON.parse(permissionsStr)
              : null;

            const adminUser = {
              ...adminUserData,
              plan: adminUserData.plan || "Enterprise", // Default to Enterprise for admins
              permissions: permissions, // Add permissions to user object
            };
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
        "⚠️ Token exists but no valid user data found, clearing auth",
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
        const adminUser = {
          ...(user as AdminUser),
          plan: (user as AdminUser).plan || "Enterprise", // Default to Enterprise for admins
        };
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
    localStorage.removeItem("admin_permissions");

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

    // Redirect to login
    router.push("/login");
    
    // Refresh the page to clear all cached data
    window.location.reload();
  };

  const refreshAuth = () => {
    checkAuth();
  };

  // Fetch fresh user data from API and update localStorage
  const fetchAndUpdateUser = async () => {
    try {
      const token = localStorage.getItem("supplier_token");
      const userType = localStorage.getItem("user_type");

      if (!token || userType !== "supplier") return;

      const freshData = await apiService.getProfile();
      if (freshData && freshData.data) {
        const userData = freshData.data;

        // Update localStorage with fresh data including plan
        const currentUserStr = localStorage.getItem("supplier_user");
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          const updatedUser = {
            ...currentUser,
            plan: userData.plan || currentUser.plan,
            status: userData.status || currentUser.status,
            profileCompletion: userData.profileCompletion || currentUser.profileCompletion,
          };
          localStorage.setItem("supplier_user", JSON.stringify(updatedUser));

          // Update auth state
          setAuthState({
            isAuthenticated: true,
            userType: "supplier",
            user: updatedUser,
            loading: false,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching fresh user data:", error);
    }
  };

  // Function to check if user can access current page
  const canAccessCurrentPage = (currentPath: string): boolean => {
    if (!authState.isAuthenticated || !authState.user) {
      return false;
    }

    // If user is admin or super_admin, only allow admin pages
    if (
      authState.userType === "admin" ||
      authState.userType === "super_admin"
    ) {
      const adminPaths = [
        "/admin",
        "/admin/",
        "/admin/user-management",
        "/admin/content-management",
        "/admin/system-settings",
        "/admin/analytics",
      ];

      // Check if current path starts with /admin
      return currentPath.startsWith("/admin");
    }

    // For suppliers, they can access all non-admin pages
    return !currentPath.startsWith("/admin");
  };

  // Function to redirect admin if they try to access non-admin pages
  const enforceAdminPageAccess = (currentPath: string) => {
    if (
      authState.isAuthenticated &&
      (authState.userType === "admin" || authState.userType === "super_admin")
    ) {
      if (!canAccessCurrentPage(currentPath)) {
        router.push("/admin");
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    checkAuth();
    // Fetch fresh user data to update plan status after subscription
    fetchAndUpdateUser();
  }, []);

  // Client-side admin access restriction
  useEffect(() => {
    if (
      authState.isAuthenticated &&
      (authState.userType === "admin" ||
        authState.userType === "super_admin") &&
      typeof window !== "undefined"
    ) {
      const currentPath = window.location.pathname;
      if (!canAccessCurrentPage(currentPath)) {
        router.push("/admin");
      }
    }
  }, [authState.isAuthenticated, authState.userType, router]);

  return {
    ...authState,
    login,
    logout,
    refreshAuth,
    canAccessCurrentPage,
    enforceAdminPageAccess,
  };
};
