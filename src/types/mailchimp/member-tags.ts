/**
 * TypeScript types for Mailchimp Member Tags API
 * Inferred from Zod schemas to ensure type safety
 *
 * Endpoint: GET /lists/{list_id}/members/{subscriber_hash}/tags
 * Documentation: https://mailchimp.com/developer/marketing/api/list-member-tags/list-member-tags/
 */

import { z } from "zod";
import {
  memberTagSchema,
  memberTagsSuccessSchema,
} from "@/schemas/mailchimp/lists/members/[subscriber_hash]/tags/success.schema";
import {
  memberTagsPathParamsSchema,
  memberTagsQueryParamsSchema,
} from "@/schemas/mailchimp/lists/members/[subscriber_hash]/tags/params.schema";
import { memberTagsErrorSchema } from "@/schemas/mailchimp/lists/members/[subscriber_hash]/tags/error.schema";

/**
 * Individual tag assigned to a member
 */
export type MemberTag = z.infer<typeof memberTagSchema>;

/**
 * Success response from the member tags endpoint
 */
export type MemberTagsResponse = z.infer<typeof memberTagsSuccessSchema>;

/**
 * Path parameters for member tags endpoint
 */
export type MemberTagsPathParams = z.infer<typeof memberTagsPathParamsSchema>;

/**
 * Query parameters for member tags endpoint
 */
export type MemberTagsQueryParams = z.infer<typeof memberTagsQueryParamsSchema>;

/**
 * Error response from member tags endpoint
 */
export type MemberTagsError = z.infer<typeof memberTagsErrorSchema>;
