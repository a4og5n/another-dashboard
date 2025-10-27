/**
 * TypeScript types for Mailchimp Member Goals API
 * Inferred from Zod schemas to ensure type safety
 *
 * Endpoint: GET /lists/{list_id}/members/{subscriber_hash}/goals
 * Documentation: https://mailchimp.com/developer/marketing/api/list-member-goal/list-member-goal-events/
 */

import { z } from "zod";
import {
  goalEventSchema,
  memberGoalsSuccessSchema,
} from "@/schemas/mailchimp/lists/member-goals/success.schema";
import {
  memberGoalsPathParamsSchema,
  memberGoalsQueryParamsSchema,
} from "@/schemas/mailchimp/lists/member-goals/params.schema";
import { memberGoalsErrorSchema } from "@/schemas/mailchimp/lists/member-goals/error.schema";

/**
 * Individual goal event for a list member
 */
export type GoalEvent = z.infer<typeof goalEventSchema>;

/**
 * Success response from the member goals endpoint
 */
export type MemberGoalsResponse = z.infer<typeof memberGoalsSuccessSchema>;

/**
 * Path parameters for member goals endpoint
 */
export type MemberGoalsPathParams = z.infer<typeof memberGoalsPathParamsSchema>;

/**
 * Query parameters for member goals endpoint
 */
export type MemberGoalsQueryParams = z.infer<
  typeof memberGoalsQueryParamsSchema
>;

/**
 * Error response from member goals endpoint
 */
export type MemberGoalsError = z.infer<typeof memberGoalsErrorSchema>;
