/**
 * Mailchimp API Campaign Advice Error Response Schema
 *
 * Endpoint: GET /reports/{campaign_id}/advice
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-advice/list-campaign-feedback/
 *
 * Standard Mailchimp error response schema
 *
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * Last verified: 2025-01-22
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

// Campaign advice error response schema - uses standard Mailchimp error format
export const campaignAdviceErrorSchema = errorSchema;
