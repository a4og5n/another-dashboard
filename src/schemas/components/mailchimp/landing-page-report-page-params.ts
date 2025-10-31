/**
 * Landing Page Report Page Params Schemas
 * Validation schemas for landing-page-report page params and search params
 */

import { z } from "zod";

/**
 * Schema for landing page report page route params
 * Validates the outreach_id from the URL
 */
export const landingPageReportPageParamsSchema = z.object({
  outreach_id: z.string().min(1, "outreach_id parameter is required"),
});

/**
 * Inferred TypeScript types from schemas
 */
export type LandingPageReportPageParams = z.infer<
  typeof landingPageReportPageParamsSchema
>;
