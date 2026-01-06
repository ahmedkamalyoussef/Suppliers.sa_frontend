"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import MaintenancePage from "./MaintenancePage";

export default function MaintenanceChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    const checkMaintenanceStatus = async () => {
      try {
        const { apiService } = await import("../lib/api");
        const response = await apiService.getMaintenanceStatus();



        if (response.success && response.maintenance_mode) {
          setIsMaintenanceMode(true);
        } else {

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
  }, []);

  // Handle maintenance mode logic - ONLY for logged in suppliers
  useEffect(() => {
    if (isLoading) return;


    // If maintenance mode is NOT active, allow everything
    if (!isMaintenanceMode) {
      return;
    }

    // If user is admin, allow admin pages only
    if (user && (user.role === "admin" || user.role === "super_admin")) {
      if (!pathname.startsWith("/admin")) {
        router.push("/admin/dashboard");
      }
      return;
    }

    // If no user (logged out), allow access to login page only
    if (!user) {
      if (!isLoginPage) {
        router.push("/login");
      }
      return;
    }

    // If user is supplier, logout them
    if (user && user.role === "supplier") {
      logout();
      return;
    }
  }, [isMaintenanceMode, user, pathname, isLoading, router, logout]);

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If maintenance mode is active and user is supplier, show maintenance page
  if (isMaintenanceMode && user?.role === "supplier") {
    return <MaintenancePage />;
  }

  // Check if we're on login page (with or without trailing slash)
  const isLoginPage = pathname === "/login" || pathname === "/login/";

  // If maintenance mode is active, NOT on login page, and NOT admin - show maintenance page
  if (
    isMaintenanceMode &&
    !isLoginPage &&
    (!user || (user.role !== "admin" && user.role !== "super_admin"))
  ) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}
