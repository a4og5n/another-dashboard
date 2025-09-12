import { z } from "zod";

/**
 * Mailchimp Campaigns Page Query Parameters Schema
 * Validates query parameters for the campaigns page
 *
 * Follows project guidelines:
 * - Use schemas for all validation (no inline validation)
 * - Define proper error messages
 * - Support transformation and defaults
 */

/**
 * Campaign report types enum (imported from report-list-query)
 */
export const CAMPAIGN_TYPES = [
  "regular",
  "plaintext",
  "absplit",
  "rss",
  "variate",
] as const;

/**
 * Per-page options for campaigns table
 */
export const CAMPAIGNS_PER_PAGE_OPTIONS = [10, 20, 50] as const;

/**
 * Schema for campaigns page URL search parameters
 */
export const CampaignsPageQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .refine((val) => Number.isInteger(val) && val >= 1, {
      message: "Page must be a positive integer",
    }),
  perPage: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .refine(
      (val) =>
        CAMPAIGNS_PER_PAGE_OPTIONS.includes(
          val as (typeof CAMPAIGNS_PER_PAGE_OPTIONS)[number],
        ),
      {
        message: `Per page must be one of: ${CAMPAIGNS_PER_PAGE_OPTIONS.join(", ")}`,
      },
    ),
  type: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || CAMPAIGN_TYPES.includes(val as (typeof CAMPAIGN_TYPES)[number]),
      {
        message: `Campaign type must be one of: ${CAMPAIGN_TYPES.join(", ")}`,
      },
    ),
  before_send_time: z.string().optional(),
  since_send_time: z.string().optional(),
});

/**
 * Inferred type from the schema
 */
export type CampaignsPageQuery = z.infer<typeof CampaignsPageQuerySchema>;
