import { z } from "zod";
import { MailchimpAudienceSchema } from "@/schemas/mailchimp/audience.schema";

/**
 * MailchimpAudienceResponseSchema
 * Zod schema for Mailchimp Audience API success response.
 * Source: https://mailchimp.com/developer/marketing/api/audiences/get-a-list-of-audiences/
 */
export const MailchimpAudienceResponseSchema = z.object({
  audiences: z.array(MailchimpAudienceSchema),
  total_items: z.number(),
  // Add other metadata fields from the API as needed
});
