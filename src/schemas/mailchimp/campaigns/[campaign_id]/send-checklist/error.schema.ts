/**
 * Get Campaign Send Checklist Error Response Schema
 *
 * Mailchimp API: GET /campaigns/{campaign_id}/send-checklist
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-checklist/get-campaign-send-checklist/
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response for Get Campaign Send Checklist endpoint
 * Reuses common Mailchimp API error format
 *
 * Common error scenarios:
 * - 404: Campaign not found (invalid campaign_id)
 * - 401: Unauthorized (invalid or expired access token)
 * - 403: Forbidden (insufficient permissions)
 */
export const campaignSendChecklistErrorSchema = errorSchema;
