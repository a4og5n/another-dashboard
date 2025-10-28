/**
 * List Member Goals - Error Response Schema
 *
 * Defines validation for error responses from GET /lists/{list_id}/members/{subscriber_hash}/goals
 *
 * Follows standard Mailchimp error response pattern
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response schema for member goals endpoint
 *
 * Uses standard Mailchimp error format:
 * - type: Error type identifier
 * - title: Human-readable error title
 * - status: HTTP status code
 * - detail: Detailed error message
 * - instance: Request identifier
 */
export const memberGoalsErrorSchema = errorSchema;
