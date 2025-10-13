/**
 * Clear Auth State Utility Route
 * Helps clear Kinde authentication cookies and state
 *
 * This is a development utility to help resolve OAuth state mismatch errors
 * Usage: Visit /api/auth/clear-state in your browser
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
      message: "Auth state cleared successfully",
      deletedCookies,
      instructions:
        "Please close this tab, clear your browser cache, and try logging in again.",
    });
  } catch (error) {
    console.error("Error clearing auth state:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear auth state",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
