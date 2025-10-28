/**
 * Mailchimp API List Growth History Params Schema
 * Schema for request parameters to the list growth history endpoint
 *
 * Endpoint: GET /lists/{list_id}/growth-history
 * Documentation: https://mailchimp.com/developer/marketing/api/list-growth-history/list-growth-history-data/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { sortDirectionSchema } from "@/schemas/mailchimp/common/sorting.schema";

/**
 * Literal for month sort field (only valid sort field for growth history)
 */
export const GROWTH_HISTORY_SORT_FIELD = "month" as const;

/**
 * Path parameters for list growth history endpoint
 * Identifies which list to fetch growth history for
 */
export const growthHistoryPathParamsSchema = z
  .object({
    list_id: z.string().min(1), // Unique ID for the list
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Query parameters for list growth history endpoint
 * Controls pagination and field filtering
 */
export const growthHistoryQueryParamsSchema = z
  .object({
    fields: z.string().optional(), // Comma-separated fields to include
    exclude_fields: z.string().optional(), // Comma-separated fields to exclude
    count: z.coerce.number().min(1).max(1000).default(10), // Number of records (1-1000)
    offset: z.coerce.number().min(0).default(0), // Records to skip for pagination
    sort_field: z.literal(GROWTH_HISTORY_SORT_FIELD).optional(), // Sort field (only 'month')
    sort_dir: sortDirectionSchema, // Sort direction (ASC or DESC)
  })
  .strict(); // Reject unknown properties for input validation
