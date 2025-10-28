/**
 * List Member Notes - Request Parameters Schema
 *
 * Defines validation for GET /lists/{list_id}/members/{subscriber_hash}/notes
 *
 * ⚠️ ASSUMED FIELDS - Based on Mailchimp API patterns
 * Source: Similar endpoints (Member Tags, Member Info)
 * Verification required: Test with real API response during implementation
 *
 * @see https://mailchimp.com/developer/marketing/api/list-member-notes/list-recent-member-notes/
 */

import { z } from "zod";
import { createEnumSortingSchema } from "@/schemas/mailchimp/common/sorting.schema";

/**
 * Sort field enum values for Member Notes API
 */
export const MEMBER_NOTES_SORT_FIELDS = [
  "created_at",
  "updated_at",
  "note_id",
] as const;

/**
 * Path parameters for member notes endpoint
 */
export const memberNotesPathParamsSchema = z
  .object({
    list_id: z.string().min(1, "List ID is required"),
    subscriber_hash: z
      .string()
      .min(1, "Subscriber hash is required")
      .describe("MD5 hash of lowercase email address"),
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Query parameters for member notes endpoint
 *
 * Follows standard Mailchimp pagination pattern with sorting support
 */
export const memberNotesQueryParamsSchema = z
  .object({
    fields: z.string().optional(), // Comma-separated fields to include
    exclude_fields: z.string().optional(), // Comma-separated fields to exclude
    count: z.coerce.number().min(1).max(1000).default(10), // Number of records (1-1000)
    offset: z.coerce.number().min(0).default(0), // Records to skip for pagination
    ...createEnumSortingSchema(MEMBER_NOTES_SORT_FIELDS).shape, // sort_field, sort_dir
  })
  .strict(); // Reject unknown properties for input validation
