import { z } from "zod";

/**
 * Mailchimp OAuth2 Zod Schemas
 * Based on: https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/
 *
 * Note: Using Zod 4 syntax with z.url(), z.email(), etc.
 */

/**
 * Authorization URL parameters schema
 */
export const oAuthAuthorizationParamsSchema = z.object({
  response_type: z.literal("code"),
  client_id: z.string(),
  redirect_uri: z.url(),
  state: z.string().optional(), // CSRF protection
});

/**
 * Token exchange request schema
 */
export const oAuthTokenRequestSchema = z.object({
  grant_type: z.literal("authorization_code"),
  client_id: z.string(),
  client_secret: z.string(),
  redirect_uri: z.url(),
  code: z.string(),
});

/**
 * Token response from Mailchimp schema
 */
export const oAuthTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal("bearer"),
  scope: z.string().optional(),
});

/**
 * Metadata response schema (to get server prefix)
 */
export const oAuthMetadataResponseSchema = z.object({
  dc: z.string(), // Data center / server prefix
  role: z.string().optional(),
  accountname: z.string().optional(),
  user_id: z.number().optional(),
  login: z
    .object({
      email: z.email().optional(),
      avatar: z.url().optional(),
      login_id: z.string().optional(),
      login_name: z.string().optional(),
      login_email: z.email().optional(),
    })
    .optional(),
  api_endpoint: z.url(),
});

/**
 * Callback query parameters schema
 */
export const oAuthCallbackParamsSchema = z.object({
  code: z.string().optional(),
  state: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});
