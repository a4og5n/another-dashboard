/**
 * TypeScript type for Mailchimp reports API query parameters
 *
 * Inferred from Zod schema in src/schemas/mailchimp/reports-params.schema.ts
 *
 * Parameters:
 *   - fields?: string (comma-separated) or string[] (converted by utility)
 *   - exclude_fields?: string (comma-separated) or string[] (converted by utility)
 *   - count?: number
 *   - offset?: number
 *   - type?: "regular" | "plaintext" | "absplit" | "rss" | "variate"
 *   - before_send_time?: string
 *   - since_send_time?: string
 *   - folder_id?: string
 *   - member_id?: string
 *   - list_id?: string
 *   - sort_field?: string
 *   - sort_dir?: "ASC" | "DESC"
 *
 * Used for type-safe API validation and request handling.
 *
 * Reference: https://mailchimp.com/developer/marketing/api/reports/list-campaign-reports/
 */
import { z } from "zod";
import { ReportListParamsSchema } from "@/schemas/mailchimp/reports-params.schema";

export type ReportsQueryBase = z.infer<typeof ReportListParamsSchema>;

export interface ReportsQuery {
  fields?: string | string[];
  exclude_fields?: string | string[];
  count?: number;
  offset?: number;
  type?: "regular" | "plaintext" | "absplit" | "rss" | "variate";
  before_send_time?: string;
  since_send_time?: string;
  folder_id?: string;
  member_id?: string;
  list_id?: string;
  sort_field?: string;
  sort_dir?: "ASC" | "DESC";
}
