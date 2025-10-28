/**
 * Mailchimp Campaign Click List Parameters Schema
 * Schema for path and query parameters for campaign click list endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/click-details
 * Documentation: https://mailchimp.com/developer/marketing/api/click-reports/list-campaign-click-details/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { createEnumSortingSchema } from "@/schemas/mailchimp/common/sorting.schema";

/**
 * Sort field enum values for Click Details Reports API
 */
export const CLICK_DETAILS_SORT_FIELDS = [
  "total_clicks",
  "unique_clicks",
] as const;

/**
 * Schema for path parameters (campaign_id)
 */
export const clickListPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1),
  })
  .strict();

/**
 * Schema for query parameters (pagination and field filtering)
 */
export const clickListQueryParamsSchema = z
  .object({
    fields: z.string().optional(), // Comma-separated fields to include
    exclude_fields: z.string().optional(), // Comma-separated fields to exclude
    count: z.coerce.number().min(1).max(1000).default(10), // .default() makes it optional
    offset: z.coerce.number().min(0).default(0), // .default() makes it optional
    ...createEnumSortingSchema(CLICK_DETAILS_SORT_FIELDS).shape,
  })
  .strict(); // Reject unknown properties for input validation
