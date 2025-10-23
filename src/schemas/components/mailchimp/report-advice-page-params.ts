/**
 * Campaign Advice Page Params Schema
 * Schema for validating Campaign Advice page route and search parameters
 *
 * @see src/app/mailchimp/reports/[id]/advice/page.tsx
 */

import { z } from "zod";

/**
 * Campaign Advice page params schema
 * Validates the [id] route parameter
 */
export const campaignAdvicePageParamsSchema = z.object({
  id: z.string().min(1), // Campaign ID from URL
});
