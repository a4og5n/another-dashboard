/**
 * Get Interest Category Info Success Response Schema
 * Schema for the successful response from the get interest category info endpoint
 *
 * Endpoint: GET /lists/{list_id}/interest-categories/{interest_category_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/interest-categories/get-interest-category-info/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";
import { INTEREST_CATEGORY_TYPE } from "@/schemas/mailchimp/lists/interest-categories/success.schema";

/**
 * Success response schema for get interest category info endpoint
 * Returns details for a single interest category
 */
export const interestCategoryInfoSuccessSchema = z.object({
  list_id: z.string().min(1), // The ID for the list this interest category belongs to
  id: z.string().min(1), // The ID for the interest category
  title: z.string(), // The text description of this category
  display_order: z.number().int().min(0), // The order that the categories are displayed (0-indexed)
  type: z.enum(INTEREST_CATEGORY_TYPE), // How this category's interests appear on signup forms
  _links: z.array(linkSchema).optional(), // HATEOAS navigation links
});
