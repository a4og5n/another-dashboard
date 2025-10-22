/**
 * TypeScript types for Mailchimp Unsubscribes API
 * Inferred from Zod schemas for type safety
 */

import type { z } from "zod";
import type {
  unsubscribedMemberSchema,
  unsubscribesSuccessSchema,
} from "@/schemas/mailchimp/unsubscribes-success.schema";
import type { unsubscribesErrorSchema } from "@/schemas/mailchimp/unsubscribes-error.schema";
import type {
  unsubscribesPathParamsSchema,
  unsubscribesQueryParamsSchema,
} from "@/schemas/mailchimp/unsubscribes-params.schema";

/**
 * Single unsubscribed member
 */
export type UnsubscribedMember = z.infer<typeof unsubscribedMemberSchema>;

/**
 * Unsubscribes list success response
 */
export type UnsubscribesSuccess = z.infer<typeof unsubscribesSuccessSchema>;

/**
 * Unsubscribes error response
 */
export type UnsubscribesError = z.infer<typeof unsubscribesErrorSchema>;

/**
 * Path parameters for unsubscribes endpoint
 */
export type UnsubscribesPathParams = z.infer<
  typeof unsubscribesPathParamsSchema
>;

/**
 * Query parameters for unsubscribes endpoint
 */
export type UnsubscribesQueryParams = z.infer<
  typeof unsubscribesQueryParamsSchema
>;
