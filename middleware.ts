import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth data from cookies
  const token = request.cookies.get("supplier_token")?.value;
  const userType = request.cookies.get("user_type")?.value;

  // ==========================================
  // 1. Redirect authenticated users from login/register
  // ==========================================
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/add-business" ||
    pathname.startsWith("/reset-password") ||
    pathname === "/forgot-password"
  ) {
    if (token && userType) {
      if (userType === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else if (userType === "supplier") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    return NextResponse.next();
  }

  // ==========================================
  // 2. Protect admin pages
  // ==========================================
  if (pathname.startsWith("/admin")) {
    // Not authenticated
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated but not admin
    if (userType !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // ==========================================
  // 3. Protect supplier dashboard
  // ==========================================
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/complete-profile")
  ) {
    // Not authenticated
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Don't let admins access supplier dashboard
    if (userType === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  // ==========================================
  // 4. Restrict admin access to admin pages only
  // ==========================================
  if (token && (userType === "admin" || userType === "super_admin")) {
    // Admins can only access admin pages
    if (
      !pathname.startsWith("/admin") &&
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/_next") &&
      !pathname.includes(".") && // Skip static files
      pathname !== "/favicon.ico"
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)",
  ],
};
