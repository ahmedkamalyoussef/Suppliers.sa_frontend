"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import MaintenancePage from "./MaintenancePage";

export default function MaintenanceChecker({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        console.log("Checking maintenance status...");
        const { apiService } = await import("../lib/api");
        const response = await apiService.getMaintenanceStatus();
        
        console.log("Maintenance response:", response);
        console.log("User role:", user?.role);
        console.log("Current path:", pathname);
        
        if (response.success && response.maintenance_mode) {
          console.log("✅ Setting maintenance mode to TRUE");
          setIsMaintenanceMode(true);
        } else {
          console.log("❌ Setting maintenance mode to FALSE");
          console.log("Response success:", response.success);
          console.log("Maintenance mode:", response.maintenance_mode);
          setIsMaintenanceMode(false);
        }
      } catch (error) {
        console.error("❌ Error checking maintenance status:", error);
        setIsMaintenanceMode(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Check maintenance status immediately on component mount
    checkMaintenanceStatus();
  }, []); // Remove user dependency to check on every render

  // Handle maintenance mode logic
  useEffect(() => {
    if (isLoading) return;

    console.log("Maintenance checker: isMaintenanceMode =", isMaintenanceMode, "user role =", user?.role, "path =", pathname);

    // If maintenance mode is active
    if (isMaintenanceMode) {
      // Allow login page access
      if (pathname === "/login") {
        console.log("Maintenance checker: Allowing login page access");
        return;
      }

      // If user is not logged in, redirect to login
      if (!user) {
        console.log("Maintenance checker: Redirecting to login");
        router.push("/login");
        return;
      }

      // If user is admin or super_admin, allow access to admin pages only
      if (user.role === "admin" || user.role === "super_admin") {
        console.log("Maintenance checker: Admin user, allowing admin access");
        // Only allow admin routes
        if (!pathname.startsWith("/admin")) {
          router.push("/admin/dashboard");
        }
        return;
      }

      // If user is supplier, show maintenance page and logout
      if (user.role === "supplier") {
        console.log("Maintenance checker: Supplier user, showing maintenance page");
        logout(); // Logout the user
        return;
      }
    }
  }, [isMaintenanceMode, user, pathname, isLoading, router, logout]);

  // Show loading state while checking
  if (isLoading) {
    console.log("Maintenance checker: Loading...");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If maintenance mode is active and user is supplier, show maintenance page
  if (isMaintenanceMode && user?.role === "supplier") {
    console.log("Maintenance checker: Showing maintenance page for supplier");
    return <MaintenancePage />;
  }

  // If maintenance mode is active and trying to access non-login page without being admin
  if (isMaintenanceMode && pathname !== "/login" && (!user || (user.role !== "admin" && user.role !== "super_admin"))) {
    console.log("Maintenance checker: Blocking non-admin access");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">الموقع تحت الصيانة</h1>
          <p className="text-gray-600">يرجى تسجيل الدخول بحساب مدير للوصول إلى الموقع</p>
        </div>
      </div>
    );
  }

  console.log("Maintenance checker: Allowing normal access");
  return <>{children}</>;
}
