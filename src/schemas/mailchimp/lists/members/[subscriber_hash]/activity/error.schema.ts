/**
 * Mailchimp Member Activity Feed Error Response Schema
 * Schema for error responses from the member activity feed endpoint
 *
 * Endpoint: GET /lists/{list_id}/members/{subscriber_hash}/activity-feed
 * Documentation: https://mailchimp.com/developer/marketing/api/list-member-activity-feed/
 */
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response schema for member activity endpoint
 * Extends the common Mailchimp error schema
 *
 * Common error scenarios:
 * - 400: Invalid parameters
 * - 404: List not found, member not found
 * - 401: Invalid API key
 */
export const memberActivityErrorSchema = errorSchema;
