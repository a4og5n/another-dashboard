/**
 * Mailchimp Landing Page Report Types
 * Type definitions for landing page report endpoint
 *
 * Issue #400: Get Landing Page Report implementation
 * Endpoint: GET /reporting/landing-pages/{outreach_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/reporting-landing-pages/get-landing-page-report/
 */
import { z } from "zod";
import {
  landingPageReportPathParamsSchema,
  landingPageReportQueryParamsSchema,
} from "@/schemas/mailchimp/reporting/landing-pages/report-params.schema";
import {
  landingPageReportSuccessSchema,
  landingPageReportTimeseriesSchema,
  landingPageReportEcommerceSchema,
  signupTagSchema,
} from "@/schemas/mailchimp/reporting/landing-pages/report-success.schema";
import { landingPageReportErrorSchema } from "@/schemas/mailchimp/reporting/landing-pages/report-error.schema";

/**
 * Path parameters type
 */
export type LandingPageReportPathParams = z.infer<
  typeof landingPageReportPathParamsSchema
>;

/**
 * Query parameters type
 */
export type LandingPageReportQueryParams = z.infer<
  typeof landingPageReportQueryParamsSchema
>;

/**
 * Timeseries data type
 */
export type LandingPageReportTimeseries = z.infer<
  typeof landingPageReportTimeseriesSchema
>;

/**
 * E-commerce data type
 */
export type LandingPageReportEcommerce = z.infer<
  typeof landingPageReportEcommerceSchema
>;

/**
 * Signup tag type
 */
export type SignupTag = z.infer<typeof signupTagSchema>;

/**
 * Success response type
 */
export type LandingPageReport = z.infer<typeof landingPageReportSuccessSchema>;

/**
 * Error response type
 */
export type LandingPageReportError = z.infer<
  typeof landingPageReportErrorSchema
>;
