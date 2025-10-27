/**
 * Mailchimp API List Interest Categories Error Response Schema
 * Schema for error responses from the list interest categories endpoint
 *
 * Endpoint: GET /lists/{list_id}/interest-categories
 * Documentation: https://mailchimp.com/developer/marketing/api/interest-categories/list-interest-categories/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response schema for list interest categories endpoint
 * Uses the standard Mailchimp error schema
 */
export const listInterestCategoriesErrorSchema = errorSchema;
