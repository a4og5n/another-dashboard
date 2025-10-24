/**
 * Mailchimp API List Members Error Response Schema
 * Schema for error responses from the list members endpoint
 *
 * Endpoint: GET /lists/{list_id}/members
 * Documentation: https://mailchimp.com/developer/marketing/api/list-members/list-members-info/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response schema for list members endpoint
 * Uses the common Mailchimp error schema
 */
export const listMembersErrorSchema = errorSchema;
