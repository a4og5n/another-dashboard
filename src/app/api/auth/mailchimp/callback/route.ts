import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpOAuthService } from "@/services/mailchimp-oauth.service";
import { mailchimpConnectionRepo } from "@/db/repositories/mailchimp-connection";
import { cookies } from "next/headers";

/**
 * GET /api/auth/mailchimp/callback
 * OAuth callback endpoint - Mailchimp redirects here after authorization
 *
 * Flow:
 * 1. Verify CSRF state parameter
 * 2. Exchange authorization code for access token
 * 3. Get account metadata (server prefix, email, etc.)
 * 4. Save encrypted connection to database
 * 5. Redirect to dashboard
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  try {
    // 1. Handle OAuth errors (user denied, etc.)
    if (error) {
      console.error("OAuth error:", error, errorDescription);
      return NextResponse.redirect(
        new URL(`/mailchimp?error=${encodeURIComponent(error)}`, request.url),
      );
    }

    // 2. Verify required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/mailchimp?error=missing_parameters", request.url),
      );
    }

    // 3. Verify CSRF state
    const cookieStore = await cookies();
    const storedState = cookieStore.get("mailchimp_oauth_state")?.value;

    if (!storedState || storedState !== state) {
      console.error("State mismatch:", { storedState, receivedState: state });
      return NextResponse.redirect(
        new URL("/mailchimp?error=invalid_state", request.url),
      );
    }

    // 4. Verify user is authenticated
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.redirect(
        new URL("/mailchimp?error=unauthorized", request.url),
      );
    }

    // 5. Complete OAuth flow (exchange code + get metadata)
    const { accessToken, serverPrefix, metadata } =
      await mailchimpOAuthService.completeOAuthFlow(code);

    // 6. Check if connection already exists
    const existingConnection =
      await mailchimpConnectionRepo.findByKindeUserId(user.id);

    if (existingConnection) {
      // Update existing connection
      await mailchimpConnectionRepo.update(user.id, {
        accessToken,
        serverPrefix,
        isActive: true,
        lastValidatedAt: new Date(),
        metadata: {
          dc: metadata.dc,
          role: metadata.role,
          accountName: metadata.accountname,
          login: metadata.login,
        },
      });
    } else {
      // Create new connection
      await mailchimpConnectionRepo.create({
        kindeUserId: user.id,
        accessToken,
        serverPrefix,
        accountId: metadata.user_id?.toString(),
        email: metadata.login?.login_email || metadata.login?.email,
        username: metadata.login?.login_name,
        metadata: {
          dc: metadata.dc,
          role: metadata.role,
          accountName: metadata.accountname,
          login: metadata.login,
        },
      });
    }

    // 7. Clear state cookie
    cookieStore.delete("mailchimp_oauth_state");

    // 8. Redirect to dashboard with success message
    return NextResponse.redirect(
      new URL("/mailchimp?connected=true", request.url),
    );
  } catch (error) {
    console.error("OAuth callback error:", error);

    // Clear state cookie on error
    const cookieStore = await cookies();
    cookieStore.delete("mailchimp_oauth_state");

    return NextResponse.redirect(
      new URL("/mailchimp?error=connection_failed", request.url),
    );
  }
}
