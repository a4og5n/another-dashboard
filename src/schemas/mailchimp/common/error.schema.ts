import { z } from "zod";
/**
 * Mailchimp Error Schema (shared)
 * Used by Mailchimp API error responses.
 * Based on RFC 7807 Problem Details for HTTP APIs
 * https://mailchimp.com/developer/marketing/api/root/
 */
export const errorSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number(),
  detail: z.string(),
  instance: z.string(), // RFC 7807 instance field
});
// Type definition moved to '@/types/mailchimp/common'
