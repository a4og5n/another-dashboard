/**
 * TypeScript types for Mailchimp Member Activity Feed API
 * Inferred from Zod schemas for type safety
 */

import type { z } from "zod";
import type {
  openActivitySchema,
  clickActivitySchema,
  bounceActivitySchema,
  unsubActivitySchema,
  sentActivitySchema,
  conversationActivitySchema,
  noteActivitySchema,
  genericActivitySchema,
  memberActivityEventSchema,
  memberActivitySuccessSchema,
} from "@/schemas/mailchimp/lists/members/[subscriber_hash]/activity/success.schema";
import type { memberActivityErrorSchema } from "@/schemas/mailchimp/lists/members/[subscriber_hash]/activity/error.schema";
import type {
  memberActivityPathParamsSchema,
  memberActivityQueryParamsSchema,
} from "@/schemas/mailchimp/lists/members/[subscriber_hash]/activity/params.schema";

/**
 * Individual activity type schemas
 */
export type OpenActivity = z.infer<typeof openActivitySchema>;
export type ClickActivity = z.infer<typeof clickActivitySchema>;
export type BounceActivity = z.infer<typeof bounceActivitySchema>;
export type UnsubActivity = z.infer<typeof unsubActivitySchema>;
export type SentActivity = z.infer<typeof sentActivitySchema>;
export type ConversationActivity = z.infer<typeof conversationActivitySchema>;
export type NoteActivity = z.infer<typeof noteActivitySchema>;
export type GenericActivity = z.infer<typeof genericActivitySchema>;

/**
 * Discriminated union of all activity types
 */
export type MemberActivityEvent = z.infer<typeof memberActivityEventSchema>;

/**
 * Member activity feed success response
 */
export type MemberActivitySuccess = z.infer<typeof memberActivitySuccessSchema>;

/**
 * Member activity feed error response
 */
export type MemberActivityError = z.infer<typeof memberActivityErrorSchema>;

/**
 * Path parameters for member activity feed endpoint
 */
export type MemberActivityPathParams = z.infer<
  typeof memberActivityPathParamsSchema
>;

/**
 * Query parameters for member activity feed endpoint
 */
export type MemberActivityQueryParams = z.infer<
  typeof memberActivityQueryParamsSchema
>;
