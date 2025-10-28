/**
 * TypeScript types for Mailchimp Member Notes API
 * Inferred from Zod schemas to ensure type safety
 *
 * Endpoint: GET /lists/{list_id}/members/{subscriber_hash}/notes
 * Documentation: https://mailchimp.com/developer/marketing/api/list-member-notes/list-recent-member-notes/
 */

import { z } from "zod";
import {
  memberNoteSchema,
  memberNotesSuccessSchema,
} from "@/schemas/mailchimp/lists/members/[subscriber_hash]/notes/success.schema";
import {
  memberNotesPathParamsSchema,
  memberNotesQueryParamsSchema,
} from "@/schemas/mailchimp/lists/members/[subscriber_hash]/notes/params.schema";
import { memberNotesErrorSchema } from "@/schemas/mailchimp/lists/members/[subscriber_hash]/notes/error.schema";

/**
 * Individual note for a list member
 */
export type MemberNote = z.infer<typeof memberNoteSchema>;

/**
 * Success response from the member notes endpoint
 */
export type MemberNotesResponse = z.infer<typeof memberNotesSuccessSchema>;

/**
 * Path parameters for member notes endpoint
 */
export type MemberNotesPathParams = z.infer<typeof memberNotesPathParamsSchema>;

/**
 * Query parameters for member notes endpoint
 */
export type MemberNotesQueryParams = z.infer<
  typeof memberNotesQueryParamsSchema
>;

/**
 * Error response from member notes endpoint
 */
export type MemberNotesError = z.infer<typeof memberNotesErrorSchema>;
