import { z } from "zod";

/**
 * Literal for date_created field
 */
export const SORT_FIELD = "date_created" as const;

/**
 * Sort direction enum values for Lists API
 */
export const LISTS_SORT_DIRECTIONS = ["ASC", "DESC"] as const;

/**
 * listsParamsSchema
 * Zod schema for Mailchimp Lists API query parameters
 *
 * Based on: https://mailchimp.com/developer/marketing/api/lists/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * Supported parameters only:
 * - fields: comma-separated list of fields to include
 * - exclude_fields: comma-separated list of fields to exclude
 * - count: number of records to return (1-1000)
 * - offset: number of records to skip
 */
export const listsParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.coerce.number().int().min(1).max(1000).default(10),
    offset: z.coerce.number().int().min(0).default(0),
    before_date_created: z.iso.datetime({ offset: true }).optional(),
    since_date_created: z.iso.datetime({ offset: true }).optional(),
    before_campaign_last_sent: z.iso.datetime({ offset: true }).optional(),
    since_campaign_last_sent: z.iso.datetime({ offset: true }).optional(),
    email: z.email().optional(),
    sort_field: z.literal(SORT_FIELD).optional(),
    sort_dir: z.enum(LISTS_SORT_DIRECTIONS).optional(),
    has_ecommerce_store: z.boolean().optional(),
    include_total_contacts: z.boolean().optional(),
  })
  .strict(); // Reject unknown properties
