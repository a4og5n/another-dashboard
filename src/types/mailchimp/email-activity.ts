/**
 * TypeScript types for Mailchimp Email Activity API
 * Inferred from Zod schemas for type safety
 */

import type { z } from "zod";
import type {
  emailActivitySchema,
  emailWithActivitySchema,
  emailActivitySuccessSchema,
} from "@/schemas/mailchimp/email-activity-success.schema";
import type { emailActivityErrorSchema } from "@/schemas/mailchimp/email-activity-error.schema";
import type {
  emailActivityPathParamsSchema,
  emailActivityQueryParamsSchema,
} from "@/schemas/mailchimp/email-activity-params.schema";

/**
 * Single email activity event
 */
export type EmailActivity = z.infer<typeof emailActivitySchema>;

/**
 * Email with activity data
 */
export type EmailWithActivity = z.infer<typeof emailWithActivitySchema>;

/**
 * Email activity list success response
 */
export type EmailActivitySuccess = z.infer<typeof emailActivitySuccessSchema>;

/**
 * Email activity error response
 */
export type EmailActivityError = z.infer<typeof emailActivityErrorSchema>;

/**
 * Path parameters for email activity endpoint
 */
export type EmailActivityPathParams = z.infer<
  typeof emailActivityPathParamsSchema
>;

/**
 * Query parameters for email activity endpoint
 */
export type EmailActivityQueryParams = z.infer<
  typeof emailActivityQueryParamsSchema
>;
