/**
 * Auth Health Check API Route
 * Validates Kinde authentication configuration
 *
 * Following established API route patterns from mailchimp
 */
import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { env } from "@/lib/config";

export async function GET() {
  try {
    // Check if Kinde environment variables are configured
    const kindeConfigured = !!(
      env.KINDE_CLIENT_ID &&
      env.KINDE_CLIENT_SECRET &&
      env.KINDE_ISSUER_URL &&
      env.KINDE_SITE_URL
    );

    // Try to get current session (will be null if not authenticated)
    const session = await authService.getSession();

    return NextResponse.json({
      success: true,
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        configured: kindeConfigured,
        authenticated: !!session,
        user: session
          ? {
              id: session.user.id,
              email: session.user.email,
              displayName: authService.getDisplayName(session.user),
            }
          : null,
        environment: {
          hasClientId: !!env.KINDE_CLIENT_ID,
          hasClientSecret: !!env.KINDE_CLIENT_SECRET,
          hasIssuerUrl: !!env.KINDE_ISSUER_URL,
          hasSiteUrl: !!env.KINDE_SITE_URL,
        },
      },
    });
  } catch (error) {
    console.error("Auth health check error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Authentication health check failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
