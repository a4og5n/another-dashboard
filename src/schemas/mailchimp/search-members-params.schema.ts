/**
 * Search Members Query Parameters Schema
 * Validates query parameters for the Mailchimp Search Members endpoint
 *
 * Endpoint: GET /search-members
 * Source: https://mailchimp.com/developer/marketing/api/search-members/
 */

import { z } from "zod";

/**
 * Query parameters schema for Search Members endpoint
 *
 * Note: The search-members endpoint only searches in email, FNAME (first name),
 * and LNAME (last name) fields. It does not support searching custom merge fields.
 */
export const searchMembersQueryParamsSchema = z
  .object({
    query: z.string().min(1),
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    list_id: z.string().optional(),
  })
  .strict();
