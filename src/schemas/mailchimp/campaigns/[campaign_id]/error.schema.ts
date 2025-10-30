/**
 * Get Campaign Error Response Schema
 *
 * Mailchimp API: GET /campaigns/{campaign_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/campaigns/get-campaign-info/
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response for Get Campaign endpoint
 * Reuses common Mailchimp API error format
 *
 * Common error scenarios:
 * - 404: Campaign not found (invalid campaign_id)
 * - 401: Unauthorized (invalid or expired access token)
 * - 403: Forbidden (insufficient permissions)
 */
export const campaignErrorSchema = errorSchema;
