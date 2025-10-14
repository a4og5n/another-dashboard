/**
 * Clear Auth State Utility Route
 * Helps clear Kinde authentication cookies and state
 *
 * This utility helps resolve OAuth state mismatch errors automatically
 * Called by the AuthErrorContent component on the /auth-error page
 * Can also be visited directly: /api/auth/clear-state
 */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();

    // Get all cookies
    const allCookies = cookieStore.getAll();

    // Delete all Kinde-related cookies
    const deletedCookies: string[] = [];
    for (const cookie of allCookies) {
      if (
        cookie.name.startsWith("kinde") ||
        cookie.name.includes("state") ||
        cookie.name.includes("auth") ||
        cookie.name.includes("session")
      ) {
        cookieStore.delete(cookie.name);
        deletedCookies.push(cookie.name);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Authentication state cleared successfully",
      deletedCookies,
      count: deletedCookies.length,
      nextSteps:
        "Authentication state has been cleared. You can now try signing in again.",
    });
  } catch (error) {
    console.error("Error clearing auth state:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear authentication state",
        message: error instanceof Error ? error.message : "Unknown error",
        recommendation:
          "Please manually clear your browser cache and cookies, then try again.",
      },
      { status: 500 },
    );
  }
}
