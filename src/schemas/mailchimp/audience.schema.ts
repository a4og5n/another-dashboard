/**
 * Mailchimp Audience Schema
 * Updated to match actual Mailchimp Marketing API response structure
 *
 * Issue #84: Removed unverified fields and aligned with official API documentation
 * Conservative approach: only includes documented or verified fields
 */
import { z } from "zod";

/**
 * Schema for audience aggregate statistics
 * Simplified to match data actually available from Mailchimp API
 */
export const AudienceStatsSchema = z.object({
  total_audiences: z.number().int().min(0),
  total_members: z.number().int().min(0),
  audiences_by_visibility: z.object({
    pub: z.number().int().min(0),
    prv: z.number().int().min(0),
  }),
});
