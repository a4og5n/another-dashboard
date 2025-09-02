import { mailchimpErrorResponseSchema } from "@/schemas/mailchimp/common/error-response.schema";

/**
 * Mailchimp API Root Error Response Schema
 * Uses the shared Mailchimp error response schema without extensions.
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * Issue #118: API Root error responses follow the same RFC 7807 structure as other endpoints
 */
export const mailchimpRootErrorResponseSchema = mailchimpErrorResponseSchema;
