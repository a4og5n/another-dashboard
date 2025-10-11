/**
 * Google OAuth Schema
 * Schemas for Google OAuth authentication flow with Kinde
 *
 * Following established auth schema patterns with Zod validation
 */
import { z } from "zod";

/**
 * Authentication provider enum
 * Following the established enum pattern
 */
export const AUTH_PROVIDERS = ["google", "email", "github"] as const;

/**
 * Google OAuth Initiation Schema
 * Parameters for starting Google OAuth flow
 */
export const googleOAuthInitiationSchema = z.object({
  connectionId: z.string().min(1, "Connection ID is required"),
  redirectUri: z.url("Valid redirect URI is required").optional(),
  state: z.string().optional(),
  org_code: z.string().optional(),
});

/**
 * Google OAuth Callback Schema
 * Parameters received from Google OAuth callback
 */
export const googleOAuthCallbackSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
  state: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

/**
 * Google OAuth User Profile Schema
 * User data received from Google via Kinde
 */
export const googleOAuthUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  email: z.email("Valid email is required"),
  given_name: z.string().nullable().optional(),
  family_name: z.string().nullable().optional(),
  picture: z.url().nullable().optional(),
  email_verified: z.boolean().optional(),
  provider: z.enum(AUTH_PROVIDERS).default("google"),
});

/**
 * OAuth State Parameter Schema
 * For CSRF protection in OAuth flow
 */
export const oauthStateSchema = z.object({
  state: z.string().min(1, "State parameter is required"),
  returnTo: z.url().optional(),
  createdAt: z.number(),
  expiresAt: z.number(),
});

/**
 * OAuth Error Response Schema
 * Standardized error format for OAuth failures
 */
export const oauthErrorSchema = z.object({
  error: z.string(),
  error_description: z.string().optional(),
  error_uri: z.url().optional(),
});
