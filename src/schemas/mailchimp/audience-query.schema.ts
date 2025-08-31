import { z } from "zod";

/**
 * MailchimpAudienceQuerySchema
 * Zod schema for Mailchimp Audience API query parameters.
 * Source: https://mailchimp.com/developer/marketing/api/audiences/get-a-list-of-audiences/
 */
export const MailchimpAudienceQuerySchema = z.object({
  fields: z.string().optional(),
  exclude_fields: z.string().optional(),
  count: z.number().int().min(0).max(1000).optional(),
  offset: z.number().int().min(0).default(0),
});
