/**
 * Mailchimp API Member Info Error Response Schema
 * Schema for error responses from the get member info endpoint
 *
 * Endpoint: GET /lists/{list_id}/members/{subscriber_hash}
 * Documentation: https://mailchimp.com/developer/marketing/api/list-members/get-member-info/
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Member info error response schema
 * Uses standard Mailchimp error response structure
 *
 * Common error scenarios:
 * - 404: Member not found (invalid subscriber_hash or list_id)
 * - 401: Invalid API key or authentication failure
 * - 403: Forbidden - insufficient permissions
 * - 400: Invalid request parameters
 */
export const memberInfoErrorSchema = errorSchema;
