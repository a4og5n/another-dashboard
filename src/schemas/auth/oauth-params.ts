/**
 * OAuth connection status parameter validation schemas
 * Zod schemas for validating our custom redirect after OAuth processing
 * (Different from OAuth provider's callback params)
 */

import { z } from "zod";

/**
 * Zod schema for validating Mailchimp connection status parameters
 * Validates incoming Next.js searchParams after OAuth processing redirect
 *
 * Handles multiple input formats:
 * - String values (normal case)
 * - Array values (Next.js can send duplicate params as arrays)
 * - Undefined values (param not present)
 */
export const mailchimpConnectionParamsSchema = z.object({
  /** Success indicator from OAuth flow */
  connected: z
    .union([z.string(), z.array(z.string()), z.undefined()])
    .optional()
    .transform((val) => {
      // Handle array (take first value)
      if (Array.isArray(val)) {
        return val[0] === "true";
      }
      // Handle string
      return val === "true";
    }),
  /** Error code from OAuth flow */
  error: z
    .union([z.string(), z.array(z.string()), z.undefined()])
    .optional()
    .transform((val) => {
      // Handle undefined/empty
      if (!val) return null;
      // Handle array (take first value)
      if (Array.isArray(val)) {
        const firstVal = val[0];
        return firstVal && firstVal.length > 0 ? firstVal : null;
      }
      // Handle string
      return val.length > 0 ? val : null;
    }),
  /** Alternative error message from OAuth flow */
  error_description: z
    .union([z.string(), z.array(z.string()), z.undefined()])
    .optional()
    .transform((val) => {
      // Handle undefined/empty
      if (!val) return null;
      // Handle array (take first value)
      if (Array.isArray(val)) {
        const firstVal = val[0];
        return firstVal && firstVal.length > 0 ? firstVal : null;
      }
      // Handle string
      return val.length > 0 ? val : null;
    }),
});
