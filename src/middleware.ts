/**
 * Next.js Middleware for Kinde Authentication
 * Protects routes and handles authentication redirects
 *
 * Following Next.js 15 App Router middleware patterns with Kinde withAuth
 */
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth({
  isReturnToCurrentPage: true,
  loginPage: "/login",
  publicPaths: ["/", "/login", "/register", "/auth-error", "/api/auth"],
});

/**
 * Matcher configuration for Next.js middleware
 * Specify which routes this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Run middleware on all routes that need protection:
     * - /mailchimp and its subroutes
     * - Exclude API auth routes, static files, and Next.js internals
     */
    "/mailchimp/:path*",
  ],
};
