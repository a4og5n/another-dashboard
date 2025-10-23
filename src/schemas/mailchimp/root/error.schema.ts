import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Mailchimp API Root Error Schema
 * Uses the shared Mailchimp error schema without extensions.
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * Issue #118: API Root error responses follow the same RFC 7807 structure as other endpoints
 */
export const rootErrorSchema = errorSchema;
