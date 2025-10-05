import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpOAuthService } from "@/services/mailchimp-oauth.service";
import { cookies } from "next/headers";

/**
 * POST /api/auth/mailchimp/authorize
 * Initiates Mailchimp OAuth flow
 *
 * Flow:
 * 1. Check user is authenticated (Kinde)
 * 2. Generate authorization URL with state parameter
 * 3. Store state in cookie for CSRF verification
 * 4. Return authorization URL to client
 */
export async function POST() {
  try {
    // 1. Verify user is authenticated
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 },
      );
    }

    // 2. Generate authorization URL
    const { url, state } = mailchimpOAuthService.generateAuthorizationUrl();

    // 3. Store state in secure HTTP-only cookie for CSRF verification
    const cookieStore = await cookies();
    cookieStore.set("mailchimp_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });

    // 4. Return authorization URL
    return NextResponse.json({ url });
  } catch (error) {
    console.error("OAuth authorization error:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth flow" },
      { status: 500 },
    );
  }
}
