/**
 * Get Campaign Success Response Schema
 *
 * Mailchimp API: GET /campaigns/{campaign_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/campaigns/get-campaign-info/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { campaignSchema } from "@/schemas/mailchimp/campaigns/campaigns-success.schema";

/**
 * Success response schema for Get Campaign endpoint
 *
 * Returns a single campaign object with all details including:
 * - Campaign settings and configuration
 * - Recipient information
 * - Tracking options
 * - Performance metrics (if sent)
 * - RSS options (if RSS campaign)
 * - A/B split options (if A/B test)
 * - Variate settings (if multivariate)
 */
export const campaignSuccessSchema = campaignSchema;
