/**
 * Landing Pages Type Definitions
 * Inferred from Zod schemas for type safety
 */

import { z } from "zod";
import {
  landingPagesQueryParamsSchema,
  LANDING_PAGE_SORT_FIELDS,
} from "@/schemas/mailchimp/landing-pages/landing-pages-params.schema";
import {
  landingPagesSuccessSchema,
  landingPageSchema,
  landingPageTrackingSchema,
  LANDING_PAGE_STATUS,
} from "@/schemas/mailchimp/landing-pages/landing-pages-success.schema";
import { landingPagesErrorSchema } from "@/schemas/mailchimp/landing-pages/landing-pages-error.schema";
import {
  landingPageInfoPathParamsSchema,
  landingPageInfoQueryParamsSchema,
} from "@/schemas/mailchimp/landing-pages/[page_id]/params.schema";
import { landingPageInfoSuccessSchema } from "@/schemas/mailchimp/landing-pages/[page_id]/success.schema";
import { landingPageInfoErrorSchema } from "@/schemas/mailchimp/landing-pages/[page_id]/error.schema";

// List Params
export type LandingPagesQueryParams = z.infer<
  typeof landingPagesQueryParamsSchema
>;

// List Success response
export type LandingPagesSuccess = z.infer<typeof landingPagesSuccessSchema>;
export type LandingPage = z.infer<typeof landingPageSchema>;
export type LandingPageTracking = z.infer<typeof landingPageTrackingSchema>;

// List Error response
export type LandingPagesError = z.infer<typeof landingPagesErrorSchema>;

// Detail Params
export type LandingPageInfoPathParams = z.infer<
  typeof landingPageInfoPathParamsSchema
>;
export type LandingPageInfoQueryParams = z.infer<
  typeof landingPageInfoQueryParamsSchema
>;

// Detail Success response
export type LandingPageInfoSuccess = z.infer<
  typeof landingPageInfoSuccessSchema
>;

// Detail Error response
export type LandingPageInfoError = z.infer<typeof landingPageInfoErrorSchema>;

// Constants
export type LandingPageStatus = (typeof LANDING_PAGE_STATUS)[number];
export type LandingPageSortField = (typeof LANDING_PAGE_SORT_FIELDS)[number];
