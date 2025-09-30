/**
 * Mailchimp API Lists Error Schema
 * Schema for error responses from the lists endpoint
 *
 * Endpoint: GET /lists
 * Documentation: https://mailchimp.com/developer/marketing/api/lists/get-list-info/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 * Reuses common error schema from shared schemas
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Lists error schema
 * Reuses the shared Mailchimp error structure
 */
export const listsErrorSchema = errorSchema;
