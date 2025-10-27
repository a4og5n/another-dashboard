/**
 * Mailchimp API List Interest Categories Params Schema
 * Schema for request parameters to the list interest categories endpoint
 *
 * Endpoint: GET /lists/{list_id}/interest-categories
 * Documentation: https://mailchimp.com/developer/marketing/api/interest-categories/list-interest-categories/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { listIdPathParamsSchema } from "@/schemas/mailchimp/common/path-params.schema";
import { INTEREST_CATEGORY_TYPE } from "@/schemas/mailchimp/lists/interest-categories/success.schema";

/**
 * Path parameters for list interest categories endpoint
 * Uses the standard list ID path parameter schema
 */
export const listInterestCategoriesPathParamsSchema = listIdPathParamsSchema;

/**
 * Query parameters for list interest categories endpoint
 * Controls pagination, filtering, and field selection
 */
export const listInterestCategoriesQueryParamsSchema = z
  .object({
    /**
     * Comma-separated list of fields to include in the response
     */
    fields: z.string().optional(),
    /**
     * Comma-separated list of fields to exclude from the response
     */
    exclude_fields: z.string().optional(),
    /**
     * Number of records to return per page
     * @default 10
     * @min 1
     * @max 1000
     */
    count: z.coerce.number().min(1).max(1000).default(10),
    /**
     * Number of records to skip for pagination
     * @default 0
     */
    offset: z.coerce.number().min(0).default(0),
    /**
     * Restrict results to a specific type of interest group
     * Valid values: checkboxes, dropdown, radio, hidden
     */
    type: z.enum(INTEREST_CATEGORY_TYPE).optional(),
  })
  .strict(); // Reject unknown properties for input validation
