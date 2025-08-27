/**
 * Zod schema for Mailchimp campaigns API query parameters
 * Strictly validates all supported parameters for GET /reports (list campaign reports)
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

export const mailchimpCampaignsQuerySchema = z.object({
  fields: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    )
    .optional()
    .describe("Comma-separated list of fields to include in response as array"),
  exclude_fields: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    )
    .optional()
    .describe(
      "Comma-separated list of fields to exclude from response as array",
    ),
  count: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((val) => val >= 0 && val <= 1000, {
      message: "count must be between 0 and 1000",
    })
    .optional()
    .describe("Number of records to return (max 1000)"),
  offset: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((val) => val >= 0, {
      message: "offset must be >= 0",
    })
    .optional()
    .describe("Number of records to skip"),
  type: z
    .enum(["regular", "plaintext", "absplit", "rss", "automation", "variate"])
    .optional()
    .describe("Type of campaign"),
  before_send_time: z
    .string()
    .optional()
    .describe("ISO8601 date string: campaigns sent before this time"),
  since_send_time: z
    .string()
    .optional()
    .describe("ISO8601 date string: campaigns sent after this time"),
});
