import { z } from "zod";
import { sortDirectionSchema } from "@/schemas/mailchimp/common/sorting.schema";
import {
  dateCreatedFilterSchema,
  campaignLastSentFilterSchema,
} from "@/schemas/mailchimp/common/date-filters.schema";

/**
 * Literal for date_created field
 */
export const SORT_FIELD = "date_created" as const;

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
    fields: z.string().optional(), // Comma-separated fields to include
    exclude_fields: z.string().optional(), // Comma-separated fields to exclude
    count: z.coerce.number().int().min(1).max(1000).default(10), // Number of records (1-1000)
    offset: z.coerce.number().int().min(0).default(0), // Records to skip for pagination
    ...dateCreatedFilterSchema.shape, // before_date_created, since_date_created
    ...campaignLastSentFilterSchema.shape, // before_campaign_last_sent, since_campaign_last_sent
    email: z.email().optional(), // Filter by email address
    sort_field: z.literal(SORT_FIELD).optional(), // Sort field (only date_created)
    sort_dir: sortDirectionSchema, // Sort direction (ASC or DESC)
    has_ecommerce_store: z.coerce.boolean().optional(), // Filter lists with ecommerce store
    include_total_contacts: z.coerce.boolean().optional(), // Include total_contacts in response
  })
  .strict(); // Reject unknown properties for input validation
