import { env } from "@/lib/config";
import { nanoid } from "nanoid";
import type {
  OAuthTokenResponse,
  OAuthMetadataResponse,
} from "@/types/mailchimp";

/**
 * Mailchimp OAuth2 Service
 * Handles authorization flow, token exchange, and metadata retrieval
 */

export class MailchimpOAuthService {
  private readonly clientId = env.MAILCHIMP_CLIENT_ID;
  private readonly clientSecret = env.MAILCHIMP_CLIENT_SECRET;
  private readonly redirectUri = env.MAILCHIMP_REDIRECT_URI;

  private readonly authorizationUrl =
    "https://login.mailchimp.com/oauth2/authorize";
  private readonly tokenUrl = "https://login.mailchimp.com/oauth2/token";
  private readonly metadataUrl = "https://login.mailchimp.com/oauth2/metadata";

  /**
   * Generate authorization URL with CSRF protection
   * @returns { url, state } - Redirect URL and state parameter to verify callback
   */
  generateAuthorizationUrl(): { url: string; state: string } {
    const state = nanoid(32); // Cryptographically secure random string

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId || "",
      redirect_uri: this.redirectUri || "",
      state,
    });

    const url = `${this.authorizationUrl}?${params.toString()}`;

    return { url, state };
  }

  /**
   * Exchange authorization code for access token
   * @param code - Authorization code from callback
   */
  async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: this.clientId || "",
      client_secret: this.clientSecret || "",
      redirect_uri: this.redirectUri || "",
      code,
    });

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Token exchange failed:", error);
      throw new Error(
        `Failed to exchange code for token: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data as OAuthTokenResponse;
  }

  /**
   * Get account metadata (server prefix, account info)
   * @param accessToken - OAuth access token
   */
  async getMetadata(accessToken: string): Promise<OAuthMetadataResponse> {
    const response = await fetch(this.metadataUrl, {
      headers: {
        Authorization: `OAuth ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Metadata fetch failed:", error);
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    const data = await response.json();
    return data as OAuthMetadataResponse;
  }

  /**
   * Complete OAuth flow: exchange code → get metadata
   * @param code - Authorization code from callback
   * @returns Combined token and metadata
   */
  async completeOAuthFlow(code: string): Promise<{
    accessToken: string;
    serverPrefix: string;
    metadata: OAuthMetadataResponse;
  }> {
    // Step 1: Exchange code for access token
    const tokenResponse = await this.exchangeCodeForToken(code);

    // Step 2: Get server prefix and account metadata
    const metadata = await this.getMetadata(tokenResponse.access_token);

    return {
      accessToken: tokenResponse.access_token,
      serverPrefix: metadata.dc,
      metadata,
    };
  }
}

// Singleton instance
export const mailchimpOAuthService = new MailchimpOAuthService();
