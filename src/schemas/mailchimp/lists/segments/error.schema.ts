/**
 * Mailchimp API List Segments Error Response Schema
 * Schema for error responses from the list segments endpoint
 *
 * Endpoint: GET /lists/{list_id}/segments
 * Documentation: https://mailchimp.com/developer/marketing/api/list-segments/list-segments/
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response for list segments endpoint
 * Uses the standard Mailchimp error schema
 */
export const listSegmentsErrorSchema = errorSchema;
