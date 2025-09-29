/**
 * TypeScript type for Mailchimp reports API query parameters
 *
 * Inferred from Zod schema in src/schemas/mailchimp-reports.ts
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
import { mailchimpReportsQuerySchema } from "@/schemas/mailchimp-reports";

export type MailchimpReportsQueryBase = z.infer<
  typeof mailchimpReportsQuerySchema
>;

export interface MailchimpReportsQuery
  extends Omit<MailchimpReportsQueryBase, "fields" | "exclude_fields"> {
  fields?: string[];
  exclude_fields?: string[];
}
