/**
 * Mailchimp API List Interest Categories Success Response Schema
 * Schema for the successful response from the list interest categories endpoint
 *
 * Endpoint: GET /lists/{list_id}/interest-categories
 * Documentation: https://mailchimp.com/developer/marketing/api/interest-categories/list-interest-categories/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Interest category type enum
 * Defines how the category is displayed in subscription forms
 */
export const INTEREST_CATEGORY_TYPE = [
  "checkboxes",
  "dropdown",
  "radio",
  "hidden",
] as const;

/**
 * Individual interest category schema
 * Represents a group of interests (subscription preferences) for a list
 * These correspond to "group titles" in the Mailchimp application
 */
export const interestCategorySchema = z.object({
  list_id: z.string().min(1), // The ID for the list this interest category belongs to
  id: z.string().min(1), // The ID for the interest category
  title: z.string(), // The text description of this category (e.g., "Email Preferences", "Topics of Interest")
  display_order: z.number().int().min(0), // The order that the categories are displayed in the list (0-indexed)
  type: z.enum(INTEREST_CATEGORY_TYPE), // Determines how this category's interests appear on signup forms (checkboxes, dropdown, radio, hidden)
  _links: z.array(linkSchema).optional(), // A list of link types and descriptions for the API schema
});

/**
 * Success response schema for list interest categories endpoint
 * Contains array of interest categories and pagination data
 */
export const listInterestCategoriesSuccessSchema = z.object({
  list_id: z.string().min(1), // The list ID
  categories: z.array(interestCategorySchema), // An array of interest categories (group titles)
  total_items: z.number().int().min(0), // The total number of items matching the query
  _links: z.array(linkSchema), // A list of link types and descriptions for the API schema
});
