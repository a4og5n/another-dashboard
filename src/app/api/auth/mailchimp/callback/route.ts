import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpOAuthService } from "@/services/mailchimp-oauth.service";
import { mailchimpConnectionRepo } from "@/db/repositories/mailchimp-connection";
import { oauthStateRepo } from "@/db/repositories/oauth-state";

/**
 * GET /api/auth/mailchimp/callback
 * OAuth callback endpoint - Mailchimp redirects here after authorization
 *
 * Flow:
 * 1. Verify required parameters
 * 2. Verify user is authenticated
 * 3. Verify CSRF state from database (one-time use)
 * 4. Exchange authorization code for access token
 * 5. Get account metadata (server prefix, email, etc.)
 * 6. Save encrypted connection to database
 * 7. Redirect to dashboard
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Use environment variable for redirects to ensure correct domain (127.0.0.1 not localhost)
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://127.0.0.1:3000";

  try {
    // 1. Handle OAuth errors (user denied, etc.)
    if (error) {
      console.error("OAuth error:", error, errorDescription);
      return NextResponse.redirect(
        new URL(`/mailchimp?error=${encodeURIComponent(error)}`, baseUrl),
      );
    }

    // 2. Verify required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/mailchimp?error=missing_parameters", baseUrl),
      );
    }

    // 3. Verify user is authenticated
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.redirect(
        new URL("/mailchimp?error=unauthorized", baseUrl),
      );
    }

    // 4. Verify CSRF state from database
    const validState = await oauthStateRepo.verifyAndConsume(
      state,
      user.id,
      "mailchimp",
    );

    if (!validState) {
      console.error(
        "OAuth state verification failed - invalid or expired state",
      );
      return NextResponse.redirect(
        new URL("/mailchimp?error=invalid_state", baseUrl),
      );
    }

    // 5. Complete OAuth flow (exchange code + get metadata)
    const { accessToken, serverPrefix, metadata } =
      await mailchimpOAuthService.completeOAuthFlow(code);

    // 6. Check if connection already exists
    const existingConnection = await mailchimpConnectionRepo.findByKindeUserId(
      user.id,
    );

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

    // 7. Redirect to dashboard with success message
    return NextResponse.redirect(
      new URL("/mailchimp?connected=true", baseUrl),
    );
  } catch (error) {
    console.error("OAuth callback error:", error);

    // Provide specific error codes based on error type
    let errorCode = "connection_failed";

    if (error instanceof Error) {
      // Network/DNS errors (cannot reach Mailchimp)
      if (
        error.message.includes("ENOTFOUND") ||
        error.message.includes("fetch failed") ||
        error.message.includes("ETIMEDOUT")
      ) {
        errorCode = "mailchimp_unreachable";
      }
      // Database errors
      else if (
        error.message.includes("Failed query") ||
        error.message.includes("database")
      ) {
        errorCode = "database_error";
      }
      // OAuth state validation errors
      else if (error.message.includes("state")) {
        errorCode = "invalid_state";
      }
    }

    // Log detailed error for debugging
    console.error(`Mailchimp OAuth callback failed with code: ${errorCode}`);

    return NextResponse.redirect(
      new URL(`/mailchimp?error=${encodeURIComponent(errorCode)}`, baseUrl),
    );
  }
}
