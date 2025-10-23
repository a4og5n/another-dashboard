/**
 * Mailchimp API Campaign Advice Query Parameters Schema
 *
 * Endpoint: GET /reports/{campaign_id}/advice
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-advice/list-campaign-feedback/
 *
 * ✅ ASSUMED FIELDS (based on Mailchimp API patterns):
 * - Path params: campaign_id (required)
 * - Query params: fields, exclude_fields (standard Mailchimp params)
 *
 * Note: This endpoint typically doesn't support pagination as it returns
 * a fixed set of advice/feedback items for the campaign.
 *
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * Last verified: 2025-01-22
 */

import { z } from "zod";

/**
 * Path parameters for campaign advice endpoint
 */
export const campaignAdvicePathParamsSchema = z
  .object({
    campaign_id: z.string().min(1),
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Query parameters for campaign advice endpoint
 */
export const campaignAdviceQueryParamsSchema = z
  .object({
    /**
     * Comma-separated list of fields to include in response
     */
    fields: z.string().optional(),

    /**
     * Comma-separated list of fields to exclude from response
     */
    exclude_fields: z.string().optional(),
  })
  .strict(); // Reject unknown properties for input validation
