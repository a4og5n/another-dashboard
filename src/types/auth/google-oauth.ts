/**
 * Google OAuth Types
 * TypeScript types inferred from Google OAuth schemas using z.infer pattern
 *
 * Following established auth type patterns
 */
import { z } from "zod";
import {
  googleOAuthInitiationSchema,
  googleOAuthCallbackSchema,
  googleOAuthUserSchema,
  oauthStateSchema,
  oauthErrorSchema,
  AUTH_PROVIDERS,
} from "@/schemas/auth/google-oauth";

/**
 * Google OAuth Initiation Type
 * Inferred from googleOAuthInitiationSchema
 */
export type GoogleOAuthInitiation = z.infer<typeof googleOAuthInitiationSchema>;

/**
 * Google OAuth Callback Type
 * Inferred from googleOAuthCallbackSchema
 */
export type GoogleOAuthCallback = z.infer<typeof googleOAuthCallbackSchema>;

/**
 * Google OAuth User Profile Type
 * Inferred from googleOAuthUserSchema
 */
export type GoogleOAuthUser = z.infer<typeof googleOAuthUserSchema>;

/**
 * OAuth State Parameter Type
 * Inferred from oauthStateSchema
 */
export type OAuthState = z.infer<typeof oauthStateSchema>;

/**
 * OAuth Error Response Type
 * Inferred from oauthErrorSchema
 */
export type OAuthError = z.infer<typeof oauthErrorSchema>;

/**
 * Authentication Provider Type
 * Inferred from AUTH_PROVIDERS enum
 */
export type AuthProvider = (typeof AUTH_PROVIDERS)[number];
