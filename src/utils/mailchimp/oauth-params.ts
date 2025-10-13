/**
 * Utility functions for parsing Mailchimp connection status parameters
 * Used when handling our custom redirect after OAuth processing
 */

import { mailchimpConnectionParamsSchema } from "@/schemas/auth";
import type { MailchimpConnectionParams } from "@/types/auth";

/**
 * Validate and parse Mailchimp connection status parameters from Next.js searchParams
 * Uses Zod schema to validate and transform search params
 *
 * @param params - Search parameters from Next.js page props
 * @returns Validated and parsed connection status parameters
 *
 * @example
 * ```typescript
 * const params = await searchParams;
 * const { connected, error } = validateMailchimpConnectionParams(params);
 * ```
 *
 * @throws {z.ZodError} If params object structure is fundamentally invalid (shouldn't happen with Next.js)
 */
export function validateMailchimpConnectionParams(
  params: Record<string, string | string[] | undefined>,
): MailchimpConnectionParams {
  // Validate and transform params using Zod schema
  const validated = mailchimpConnectionParamsSchema.parse(params);

  // Extract error from either 'error' or 'error_description', prioritizing 'error'
  const error = validated.error ?? validated.error_description ?? null;

  return {
    connected: validated.connected ?? false,
    error,
  };
}

/**
 * Check if search params contain OAuth callback data
 *
 * @param params - Search parameters from Next.js page props
 * @returns True if params contain OAuth callback data
 *
 * @example
 * ```typescript
 * const params = await searchParams;
 * const isOAuthCallback = hasOAuthCallbackParams(params);
 * ```
 */
export function hasOAuthCallbackParams(
  params: Record<string, string | string[] | undefined>,
): boolean {
  return (
    "connected" in params || "error" in params || "error_description" in params
  );
}
