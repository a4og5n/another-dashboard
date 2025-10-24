/**
 * Mailchimp API List Growth History Params Schema
 * Schema for request parameters to the list growth history endpoint
 *
 * Endpoint: GET /lists/{list_id}/growth-history
 * Documentation: https://mailchimp.com/developer/marketing/api/list-growth-history/list-growth-history-data/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Literal for month sort field (only valid sort field for growth history)
 */
export const GROWTH_HISTORY_SORT_FIELD = "month" as const;

/**
 * Sort direction enum values for Growth History API
 */
export const GROWTH_HISTORY_SORT_DIRECTIONS = ["ASC", "DESC"] as const;

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
    fields: z.string().optional(), // Comma-separated list of fields to include
    exclude_fields: z.string().optional(), // Comma-separated list of fields to exclude
    count: z.coerce.number().min(1).max(1000).default(10), // Number of records to return (default: 10, max: 1000)
    offset: z.coerce.number().min(0).default(0), // Number of records to skip (default: 0)
    sort_field: z.literal(GROWTH_HISTORY_SORT_FIELD).optional(), // Field to sort by (only 'month' is valid)
    sort_dir: z.enum(GROWTH_HISTORY_SORT_DIRECTIONS).optional(), // Sort direction (ASC or DESC)
  })
  .strict(); // Reject unknown properties for input validation
