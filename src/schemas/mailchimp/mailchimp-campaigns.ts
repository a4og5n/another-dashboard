/**
 * Zod schema for Mailchimp campaigns API query parameters
 *
 * Strictly validates all supported parameters for GET /reports (list campaign reports):
 *   - fields: Comma-separated list of fields to include in response (string, optional)
 *   - exclude_fields: Comma-separated list of fields to exclude from response (string, optional)
 *   - count: Number of records to return (string, optional, must be 0-1000)
 *   - offset: Number of records to skip (string, optional, must be >= 0)
 *   - type: Type of campaign (enum: "regular", "plaintext", "absplit", "rss", "automation", "variate", optional)
 *   - before_send_time: ISO8601 date string, campaigns sent before this time (string, optional)
 *   - since_send_time: ISO8601 date string, campaigns sent after this time (string, optional)
 *
 * Transforms and validates input for API usage. Throws on invalid input.
 *
 * Reference: https://mailchimp.com/developer/marketing/api/reports/list-campaign-reports/
 *
 * Example:
 *   mailchimpCampaignsQuerySchema.parse({ count: "10", type: "regular" })
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
    .optional(),
  offset: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((val) => val >= 0, {
      message: "offset must be >= 0",
    })
    .optional(),
  type: z
    .enum(["regular", "plaintext", "absplit", "rss", "automation", "variate"])
    .optional(),
  before_send_time: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "before_send_time must be a valid ISO8601 date string",
    })
    .optional(),
  since_send_time: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "since_send_time must be a valid ISO8601 date string",
    })
    .optional(),
});
