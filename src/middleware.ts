/**
 * Next.js Middleware for Kinde Authentication
 * Protects routes and handles authentication redirects
 * 
 * Following Next.js 15 App Router middleware patterns
 */
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

/**
 * Public routes that don't require authentication
 */
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/api/auth",
];

/**
 * Protected route patterns
 * These routes require authentication
 */
const protectedRoutes = [
  "/mailchimp",
];

/**
 * Check if a path matches any of the patterns in the list
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    // Exact match
    if (pathname === route) return true;
    
    // Wildcard match (e.g., /mailchimp matches /mailchimp/*)
    if (pathname.startsWith(route + "/")) return true;
    
    return false;
  });
}

/**
 * Custom middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API auth routes, and other Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/manifest.json") ||
    pathname.startsWith("/browserconfig.xml") ||
    pathname.startsWith("/api/auth/") // Allow Kinde auth endpoints
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (matchesRoute(pathname, publicRoutes)) {
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (matchesRoute(pathname, protectedRoutes)) {
    // Use Kinde's withAuth to handle authentication
    return withAuth(request, {
      loginPage: "/login",
      isReturnToCurrentPage: true,
    });
  }

  // Default: allow the request
  return NextResponse.next();
}

/**
 * Matcher configuration for Next.js middleware
 * Specify which routes this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (icons, manifest, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|browserconfig.xml).*)",
  ],
};