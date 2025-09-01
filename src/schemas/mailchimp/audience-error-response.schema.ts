import { mailchimpErrorResponseSchema } from "@/schemas/mailchimp/common/error-response.schema";

/**
 * Mailchimp Audience Error Response Schema
 * Uses the shared Mailchimp error response schema without extensions.
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * Issue #94: Removed undocumented audience_id field to match official API structure
 */
export const mailchimpAudienceErrorResponseSchema =
  mailchimpErrorResponseSchema;
