/**
 * Mailchimp Campaign Open List Parameters Schema
 * Schema for path and query parameters for campaign open list endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/open-details
 * Documentation: https://mailchimp.com/developer/marketing/api/open-reports/list-campaign-open-details/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { sortDirectionSchema } from "@/schemas/mailchimp/common/sorting.schema";
import { sinceFilterSchema } from "@/schemas/mailchimp/common/date-filters.schema";

/**
 * Schema for path parameters (campaign_id)
 */
export const openListPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1),
  })
  .strict();

/**
 * Schema for query parameters (pagination and field filtering)
 */
export const openListQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.coerce.number().min(1).max(1000).default(10), // .default() makes it optional
    offset: z.coerce.number().min(0).default(0), // .default() makes it optional
    since: sinceFilterSchema,
    sort_field: z.string().optional(),
    sort_dir: sortDirectionSchema,
  })
  .strict(); // Reject unknown properties for input validation
