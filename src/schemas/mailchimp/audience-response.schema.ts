import { z } from "zod";
import { MailchimpAudienceSchema } from "@/schemas/mailchimp/audience.schema";

/**
 * MailchimpAudienceResponseSchema
 * Zod schema for Mailchimp Lists API success response structure
 *
 * Issue #85: Fixed property names and added missing metadata fields
 * Based on: https://mailchimp.com/developer/marketing/api/lists/
 * Service usage: /src/services/mailchimp.service.ts getLists method
 */
export const MailchimpAudienceResponseSchema = z.object({
  // Core response data - API returns 'lists' not 'audiences'
  lists: z.array(MailchimpAudienceSchema),

  // Pagination metadata
  total_items: z.number(),

  // Account constraints/quota information
  constraints: z.object({
    may_create: z.boolean(),
    max_instances: z.number(),
    current_total_instances: z.number(),
  }),

  // Navigation links (may not always be present)
  _links: z
    .array(
      z.object({
        rel: z.string(),
        href: z.string().url(),
        method: z.string(),
        targetSchema: z.string().optional(),
        schema: z.string().optional(),
      }),
    )
    .optional(),
});
