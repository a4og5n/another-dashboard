/**
 * Kinde Auth API Route Handler
 * Handles all Kinde authentication callbacks and operations with custom error handling
 *
 * This route is required by @kinde-oss/kinde-auth-nextjs
 * Following Next.js 15 App Router patterns
 *
 * Custom error handling:
 * - Intercepts "State not found" errors and redirects to user-friendly error page
 * - Prevents raw JSON error responses from reaching users
 */
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const kindeHandler = handleAuth();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ kindeAuth: string }> },
) {
  try {
    // Call the original Kinde handler
    const response = await kindeHandler(request, context);

    // Check if response is an error (status 500 or 4xx)
    if (response.status >= 400) {
      // Try to parse error from response body
      const responseClone = response.clone();
      let errorMessage = "authentication_failed";
      let errorDescription = "An error occurred during authentication";

      try {
        const body = await responseClone.json();
        if (body.error) {
          errorMessage = body.error.includes("State not found")
            ? "state_not_found"
            : "authentication_failed";
          errorDescription = body.error;
        }
      } catch {
        // If we can't parse the body, use default error
      }

      // Redirect to auth-error page with error details
      const errorParams = new URLSearchParams({
        error: errorMessage,
        error_description: errorDescription,
      });

      return NextResponse.redirect(
        new URL(`/auth-error?${errorParams.toString()}`, request.url),
      );
    }

    return response;
  } catch (error) {
    // Handle unexpected errors
    console.error("Kinde auth handler error:", error);

    const errorParams = new URLSearchParams({
      error: "authentication_failed",
      error_description:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during authentication",
    });

    return NextResponse.redirect(
      new URL(`/auth-error?${errorParams.toString()}`, request.url),
    );
  }
}
