/**
 * TypeScript types for Mailchimp Sent To API
 * Inferred from Zod schemas for type safety
 */

import type { z } from "zod";
import type {
  sentToMemberSchema,
  sentToSuccessSchema,
} from "@/schemas/mailchimp/reports/sent-to/success.schema";
import type { sentToErrorSchema } from "@/schemas/mailchimp/reports/sent-to/error.schema";
import type {
  sentToPathParamsSchema,
  sentToQueryParamsSchema,
} from "@/schemas/mailchimp/reports/sent-to/params.schema";

/**
 * Single sent-to member (campaign recipient)
 */
export type SentToMember = z.infer<typeof sentToMemberSchema>;

/**
 * Sent-to list success response
 */
export type SentToSuccess = z.infer<typeof sentToSuccessSchema>;

/**
 * Sent-to error response
 */
export type SentToError = z.infer<typeof sentToErrorSchema>;

/**
 * Path parameters for sent-to endpoint
 */
export type SentToPathParams = z.infer<typeof sentToPathParamsSchema>;

/**
 * Query parameters for sent-to endpoint
 */
export type SentToQueryParams = z.infer<typeof sentToQueryParamsSchema>;
