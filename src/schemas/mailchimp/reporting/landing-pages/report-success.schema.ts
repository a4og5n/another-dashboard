/**
 * Mailchimp Landing Page Report Success Response Schema
 * Schema for successful responses from the landing page report endpoint
 *
 * Issue #400: Get Landing Page Report implementation
 * Endpoint: GET /reporting/landing-pages/{outreach_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/reporting-landing-pages/get-landing-page-report/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Signup tag object schema
 */
export const signupTagSchema = z.object({
  tag_id: z.number().int().min(0), // Tag ID
  tag_name: z.string(), // Tag name
});

/**
 * Timeseries data point schema
 * Represents a single data point in the timeseries with date and value
 */
const timeseriesDataPointSchema = z.object({
  date: z.iso.datetime({ offset: true }).optional(), // Date for this data point
  val: z.number().int().min(0), // Integer value for this data point
});

/**
 * Timeseries statistics data structure
 * Used for both daily_stats and weekly_stats
 */
const timeseriesStatsSchema = z.object({
  clicks: z.array(timeseriesDataPointSchema), // Array of click data points
  visits: z.array(timeseriesDataPointSchema), // Array of visit data points
  unique_visits: z.array(timeseriesDataPointSchema), // Array of unique visit data points
});

/**
 * Landing page timeseries data schema
 */
export const landingPageReportTimeseriesSchema = z.object({
  daily_stats: timeseriesStatsSchema.optional(), // Daily performance data
  weekly_stats: timeseriesStatsSchema.optional(), // Weekly performance data
});

/**
 * Landing page e-commerce data schema
 */
export const landingPageReportEcommerceSchema = z.object({
  total_revenue: z.number().min(0), // Total revenue generated
  currency_code: z.string().length(3).toUpperCase().optional(), // The three-letter ISO 4217 code for the currency (e.g., USD, EUR, GBP)
  total_orders: z.number().int().min(0), // Total orders
  average_order_revenue: z.number().min(0).optional(), // Average order revenue
});

/**
 * Landing page report success response schema
 * Contains comprehensive analytics and performance metrics
 */
export const landingPageReportSuccessSchema = z
  .object({
    id: z.string().min(1), // Landing page ID
    name: z.string(), // Landing page name
    title: z.string().optional(), // Page title
    url: z.url().optional(), // Published page URL
    published_at: z.iso.datetime({ offset: true }).optional(), // Publication timestamp
    unpublished_at: z.iso.datetime({ offset: true }).optional(), // Unpublication timestamp
    status: z.string(), // Publication status
    list_id: z.string().optional(), // Associated list ID
    visits: z.number().int().min(0).optional(), // Total page visits
    unique_visits: z.number().int().min(0).optional(), // Unique visitor count
    subscribes: z.number().int().min(0).optional(), // Number of subscribes
    clicks: z.number().int().min(0).optional(), // Total clicks
    conversion_rate: z.number().min(0).max(100).optional(), // Conversion rate percentage
    timeseries: landingPageReportTimeseriesSchema.optional(), // Time-based performance data
    ecommerce: landingPageReportEcommerceSchema.optional(), // E-commerce metrics
    web_id: z.number().int().min(0).optional(), // Web ID for the landing page
    list_name: z.string().optional(), // Associated list name
    signup_tags: z.array(signupTagSchema).optional(), // Tags applied to signups
    _links: z.array(linkSchema).optional(), // HATEOAS navigation links
  })
  .strict(); // Ensures no extra fields are present
