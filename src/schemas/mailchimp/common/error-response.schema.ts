import { z } from "zod";
/**
 * Mailchimp Error Response Schema (shared)
 * Used by Mailchimp API error responses.
 */
export const mailchimpErrorResponseSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number(),
  detail: z.string(),
});
// Type definition moved to '@/types/mailchimp/common'
