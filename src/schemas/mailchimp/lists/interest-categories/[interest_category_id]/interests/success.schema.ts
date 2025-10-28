/**
 * Mailchimp API List Interests in Category Success Response Schema
 * Schema for the successful response from the list interests in category endpoint
 *
 * Endpoint: GET /lists/{list_id}/interest-categories/{interest_category_id}/interests
 * Documentation: https://mailchimp.com/developer/marketing/api/interests/list-interests-in-category/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Individual interest schema
 * Represents a specific interest (subscription preference) within an interest category
 * These correspond to individual checkboxes, dropdown options, or radio buttons in forms
 */
export const interestSchema = z.object({
  category_id: z.string().min(1), // The ID for the interest category this interest belongs to
  list_id: z.string().min(1), // The ID for the list this interest belongs to
  id: z.string().min(1), // The ID for the interest
  name: z.string(), // The text description of the interest (e.g., "Weekly Newsletter", "Product Updates")
  subscriber_count: z.number().int().min(0), // The number of subscribers who have opted into this interest (returned as string by API)
  display_order: z.number().int().min(0), // The order that the interests display in the category (0-indexed)
  _links: z.array(linkSchema).optional(), // A list of link types and descriptions for the API schema
});

/**
 * Success response schema for list interests in category endpoint
 * Contains array of interests and pagination data
 */
export const listInterestsSuccessSchema = z.object({
  interests: z.array(interestSchema), // An array of interests for this category
  list_id: z.string().min(1), // The list ID
  category_id: z.string().min(1), // The interest category ID
  total_items: z.number().int().min(0), // The total number of items matching the query
  _links: z.array(linkSchema), // A list of link types and descriptions for the API schema
});
