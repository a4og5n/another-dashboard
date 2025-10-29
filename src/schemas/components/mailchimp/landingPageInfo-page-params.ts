/**
 * Landing Page Details Page Params Schemas
 * Validation schemas for landing page detail page params
 */

import { z } from "zod";

/**
 * Schema for landing page details page route params
 * Validates the page_id from the URL
 */
export const landingPageDetailsPageParamsSchema = z.object({
  page_id: z.string().min(1, "Page ID is required"),
});

/**
 * Inferred TypeScript types from schemas
 */
export type LandingPageDetailsPageParams = z.infer<
  typeof landingPageDetailsPageParamsSchema
>;
