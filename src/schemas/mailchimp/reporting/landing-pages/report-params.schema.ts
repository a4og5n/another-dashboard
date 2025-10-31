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
 * Currently no query parameters for this endpoint
 */
export const landingPageReportQueryParamsSchema = z.object({
  fields: z.array(z.string()).optional(), // Comma-separated list of fields to return
  exclude_fields: z.array(z.string()).optional(), // Comma-separated list of fields to exclude
});

/**
 * Combined params schema for landing page report endpoint
 * Used for server-side validation
 *
 * @property {string} outreach_id - The outreach ID for the landing page (path param)
 * @property {string[]} fields - Optional fields to include
 * @property {string[]} exclude_fields - Optional fields to exclude
 */
export const landingPageReportParamsSchema =
  landingPageReportPathParamsSchema.merge(landingPageReportQueryParamsSchema);
