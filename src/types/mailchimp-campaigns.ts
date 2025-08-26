/**
 * TypeScript type for Mailchimp campaigns API query parameters
 * Inferred from Zod schema in src/schemas/mailchimp-campaigns.ts
 *
 * Parameters:
 *   - fields: Comma-separated list of fields to include in response
 *   - exclude_fields: Comma-separated list of fields to exclude from response
 *   - count: Number of records to return (max 1000)
 *   - offset: Number of records to skip
 *   - type: Type of campaign ("regular", "plaintext", "absplit", "rss", "automation", "variate")
 *   - before_send_time: ISO8601 date string, campaigns sent before this time
 *   - since_send_time: ISO8601 date string, campaigns sent after this time
 *
 * Reference: https://mailchimp.com/developer/marketing/api/reports/list-campaign-reports/
 */
import { z } from "zod";
import { mailchimpCampaignsQuerySchema } from "../schemas/mailchimp-campaigns";

export type MailchimpCampaignsQuery = z.infer<
  typeof mailchimpCampaignsQuerySchema
>;
