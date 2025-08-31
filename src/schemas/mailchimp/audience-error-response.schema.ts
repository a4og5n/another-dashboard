import { z } from "zod";
import { mailchimpErrorResponseSchema } from "@/schemas/mailchimp/common/error-response.schema";

/**
 * Mailchimp Audience Error Response Schema
 * Extends the shared Mailchimp error response schema for audience-specific errors.
 */
export const mailchimpAudienceErrorResponseSchema = mailchimpErrorResponseSchema.extend({
  audience_id: z.string().optional(), // Example of an audience-specific error field
  // Add other audience-specific error fields as needed
});
