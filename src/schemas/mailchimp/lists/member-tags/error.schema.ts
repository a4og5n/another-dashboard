/**
 * Mailchimp API Member Tags Error Response Schema
 * Schema for error responses from the list member tags endpoint
 *
 * Endpoint: GET /lists/{list_id}/members/{subscriber_hash}/tags
 * Documentation: https://mailchimp.com/developer/marketing/api/list-member-tags/list-member-tags/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response schema for member tags endpoint
 * Uses the standard Mailchimp error schema
 *
 * Common error scenarios:
 * - 404: List ID not found
 * - 404: Member (subscriber_hash) not found
 * - 400: Invalid parameters
 * - 401: Authentication failed
 */
export const memberTagsErrorSchema = errorSchema;
