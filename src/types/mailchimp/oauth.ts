import { z } from "zod";
import {
  oAuthAuthorizationParamsSchema,
  oAuthTokenRequestSchema,
  oAuthTokenResponseSchema,
  oAuthMetadataResponseSchema,
  oAuthCallbackParamsSchema,
} from "@/schemas/mailchimp/oauth";

/**
 * Mailchimp OAuth2 TypeScript Types
 * Inferred from Zod schemas for type safety
 */

export type OAuthAuthorizationParams = z.infer<
  typeof oAuthAuthorizationParamsSchema
>;

export type OAuthTokenRequest = z.infer<typeof oAuthTokenRequestSchema>;

export type OAuthTokenResponse = z.infer<typeof oAuthTokenResponseSchema>;

export type OAuthMetadataResponse = z.infer<typeof oAuthMetadataResponseSchema>;

export type OAuthCallbackParams = z.infer<typeof oAuthCallbackParamsSchema>;
