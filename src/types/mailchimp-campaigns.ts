/**
 * TypeScript type for Mailchimp campaigns API query parameters
 *
 * Inferred from Zod schema in src/schemas/mailchimp-campaigns.ts
 *
 * Parameters:
 *   - fields?: string[]
 *   - exclude_fields?: string[]
 *   - count?: number
 *   - offset?: number
 *   - type?: "regular" | "plaintext" | "absplit" | "rss" | "automation" | "variate"
 *   - before_send_time?: string
 *   - since_send_time?: string
 *
 * Used for type-safe API validation and request handling.
 *
 * Reference: https://mailchimp.com/developer/marketing/api/reports/list-campaign-reports/
 */
import { z } from "zod";
import { mailchimpCampaignsQuerySchema } from "@/schemas/mailchimp-campaigns";

export type MailchimpCampaignsQuery = z.infer<
  typeof mailchimpCampaignsQuerySchema
>;
