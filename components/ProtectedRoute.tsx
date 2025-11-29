"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "super_admin")[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ["admin", "super_admin"],
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, userType, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // If authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push("/login");
      return;
    }

    // If user is authenticated but not an admin or super admin
    if (isAuthenticated && userType !== "admin" && userType !== "super_admin") {
      router.push("/dashboard"); // or any other appropriate page for suppliers
      return;
    }

    // If user is admin but doesn't have the required role
    if (isAuthenticated && allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(userType as "admin" | "super_admin")) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [isAuthenticated, userType, loading, router, allowedRoles, requireAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
