/**
 * List Locations - Error Response Schema
 *
 * Defines validation for error responses from GET /lists/{list_id}/locations
 *
 * Extends the common Mailchimp error schema with endpoint-specific structure
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response schema for list locations endpoint
 * Uses the common Mailchimp error structure
 */
export const listLocationsErrorSchema = errorSchema;
