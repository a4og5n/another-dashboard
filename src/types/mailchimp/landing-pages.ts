/**
 * Landing Pages Type Definitions
 * Inferred from Zod schemas for type safety
 */

import { z } from "zod";
import {
  landingPagesQueryParamsSchema,
  LANDING_PAGE_SORT_FIELDS,
} from "@/schemas/mailchimp/landing-pages-params.schema";
import {
  landingPagesSuccessSchema,
  landingPageSchema,
  landingPageTrackingSchema,
  LANDING_PAGE_STATUS,
} from "@/schemas/mailchimp/landing-pages-success.schema";
import { landingPagesErrorSchema } from "@/schemas/mailchimp/landing-pages-error.schema";

// Params
export type LandingPagesQueryParams = z.infer<
  typeof landingPagesQueryParamsSchema
>;

// Success response
export type LandingPagesSuccess = z.infer<typeof landingPagesSuccessSchema>;
export type LandingPage = z.infer<typeof landingPageSchema>;
export type LandingPageTracking = z.infer<typeof landingPageTrackingSchema>;

// Error response
export type LandingPagesError = z.infer<typeof landingPagesErrorSchema>;

// Constants
export type LandingPageStatus = (typeof LANDING_PAGE_STATUS)[number];
export type LandingPageSortField = (typeof LANDING_PAGE_SORT_FIELDS)[number];
