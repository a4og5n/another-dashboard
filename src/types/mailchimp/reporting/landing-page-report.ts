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
  landingPageReportParamsSchema,
} from "@/schemas/mailchimp/reporting/landing-pages/report-params.schema";
import {
  landingPageReportSuccessSchema,
  landingPageReportSignupsSchema,
  landingPageReportClicksSchema,
  landingPageReportTimeseriesSchema,
  landingPageReportEcommerceSchema,
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
 * Combined params type
 */
export type LandingPageReportParams = z.infer<
  typeof landingPageReportParamsSchema
>;

/**
 * Signup statistics type
 */
export type LandingPageReportSignups = z.infer<
  typeof landingPageReportSignupsSchema
>;

/**
 * Click statistics type
 */
export type LandingPageReportClicks = z.infer<
  typeof landingPageReportClicksSchema
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
 * Success response type
 */
export type LandingPageReport = z.infer<typeof landingPageReportSuccessSchema>;

/**
 * Error response type
 */
export type LandingPageReportError = z.infer<
  typeof landingPageReportErrorSchema
>;
