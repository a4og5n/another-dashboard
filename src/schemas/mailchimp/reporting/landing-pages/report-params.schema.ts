/**
 * Mailchimp Landing Page Report Params Schema
 * Schema for parameters used in landing page report endpoint
 *
 * Issue #400: Get Landing Page Report implementation
 * Endpoint: GET /reporting/landing-pages/{outreach_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/reporting-landing-pages/get-landing-page-report/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Path parameters schema for landing page report endpoint
 * Validates the outreach_id parameter
 */
export const landingPageReportPathParamsSchema = z.object({
  outreach_id: z.string().min(1, "Landing page outreach_id must not be empty"), // The outreach ID for the landing page
});

/**
 * Query parameters schema for landing page report endpoint
 */
export const landingPageReportQueryParamsSchema = z
  .object({
    /**
     * A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation.
     */
    fields: z.string().optional(),
    /**
     * A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation.
     */
    exclude_fields: z.string().optional(),
  })
  .strict();
