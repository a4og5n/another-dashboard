import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpOAuthService } from "@/services/mailchimp-oauth.service";
import { oauthStateRepo } from "@/db/repositories/oauth-state";

/**
 * POST /api/auth/mailchimp/authorize
 * Initiates Mailchimp OAuth flow
 *
 * Flow:
 * 1. Check user is authenticated (Kinde)
 * 2. Generate authorization URL with state parameter
 * 3. Store state in database for CSRF verification (expires in 10 minutes)
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

    // 3. Store state in database for CSRF verification (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await oauthStateRepo.create({
      state,
      kindeUserId: user.id,
      provider: "mailchimp",
      expiresAt,
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
