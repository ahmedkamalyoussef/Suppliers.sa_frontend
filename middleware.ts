import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth data from cookies
  const token = request.cookies.get("supplier_token")?.value;
  const userType = request.cookies.get("user_type")?.value;

  console.log(
    `🔍 Middleware check: ${pathname} | Token: ${
      token ? "✅" : "❌"
    } | UserType: ${userType || "none"}`
  );

  // ==========================================
  // 1. Redirect authenticated users from login/register
  // ==========================================
  if (pathname === "/login" || pathname === "/register") {
    if (token && userType) {
      console.log(`🔀 User already logged in as ${userType}, redirecting...`);

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
      console.log("🚫 No token, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated but not admin
    if (userType !== "admin") {
      console.log(`🚫 User type "${userType}" cannot access admin`);
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log(`✅ Admin access granted: ${pathname}`);
    return NextResponse.next();
  }

  // ==========================================
  // 3. Protect supplier dashboard
  // ==========================================
  if (pathname.startsWith("/dashboard")) {
    // Not authenticated
    if (!token) {
      console.log("🚫 No token, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Don't let admins access supplier dashboard
    if (userType === "admin") {
      console.log("🚫 Admin trying to access supplier dashboard");
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    console.log(`✅ Supplier access granted: ${pathname}`);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
};
