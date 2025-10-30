/**
 * List Campaigns Error Response Schema
 * GET /campaigns
 *
 * @see https://mailchimp.com/developer/marketing/api/campaigns/list-campaigns/
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response for campaigns endpoint
 * Reuses common Mailchimp API error format
 */
export const campaignsErrorSchema = errorSchema;
