/**
 * Search Members Error Response Schema
 * Validates error responses from the Mailchimp Search Members endpoint
 *
 * Endpoint: GET /search-members
 * Source: https://mailchimp.com/developer/marketing/api/search-members/
 * Reuses common error schema from shared schemas
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Search Members error schema
 * Reuses the shared Mailchimp error structure (RFC 7807)
 */
export const searchMembersErrorSchema = errorSchema;
