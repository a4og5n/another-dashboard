import { z } from "zod";

/**
 * Simplified Mailchimp Audience Success Response Schema
 *
 * Issue #97: Fixed schema compliance issues:
 * - Renamed from audience-response.schema.ts to audience-success.schema.ts
 * - Changed 'lists' property to 'audiences' for consistency with domain naming
 * - Simplified to only essential, documented properties
 * - Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * Based on: https://mailchimp.com/developer/marketing/api/lists/
 */

/**
 * Simplified Mailchimp Audience Schema
 * Contains only the essential properties needed for dashboard display
 */
export const MailchimpAudienceSimplified = z.object({
  id: z.string(),
  name: z.string(),
  stats: z.object({
    total_contacts: z.number(),
  }),
});

/**
 * Simplified Mailchimp Audience Success Response Schema
 * Contains only essential response data
 */
export const MailchimpAudienceSuccessSchema = z.object({
  // Changed from 'lists' to 'audiences' for consistent domain naming
  audiences: z.array(MailchimpAudienceSimplified),

  // Pagination metadata
  total_items: z.number(),
});
