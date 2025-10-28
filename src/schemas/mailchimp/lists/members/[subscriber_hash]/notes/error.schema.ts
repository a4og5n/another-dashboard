/**
 * List Member Notes - Error Response Schema
 *
 * Defines error responses for GET /lists/{list_id}/members/{subscriber_hash}/notes
 *
 * Uses standard Mailchimp error schema
 *
 * @see https://mailchimp.com/developer/marketing/api/list-member-notes/list-recent-member-notes/
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response schema for member notes endpoint
 *
 * Reuses the standard Mailchimp error schema structure
 */
export const memberNotesErrorSchema = errorSchema;
