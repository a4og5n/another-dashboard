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
 * Landing page signup statistics schema
 */
export const landingPageReportSignupsSchema = z.object({
  total_signups: z.number().min(0), // Total number of signups
});

/**
 * Landing page click statistics schema
 */
export const landingPageReportClicksSchema = z.object({
  clicks_total: z.number().min(0), // Total number of clicks
  unique_clicks: z.number().min(0), // Unique clicks
  click_rate: z.number().min(0).max(100), // Click rate percentage
});

/**
 * Landing page timeseries data schema
 */
export const landingPageReportTimeseriesSchema = z.array(
  z.object({
    timestamp: z.iso.datetime({ offset: true }), // ISO 8601 format
    unique_visits: z.number().min(0), // Unique visits at this time
    signups: z.number().min(0), // Signups at this time
  }),
);

/**
 * Landing page e-commerce data schema
 */
export const landingPageReportEcommerceSchema = z.object({
  total_revenue: z.number().min(0), // Total revenue generated
  total_orders: z.number().min(0), // Total orders
  average_order_revenue: z.number().min(0).optional(), // Average order revenue
  currency_code: z.string().optional(), // Currency code (e.g., "USD")
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
    description: z.string().optional(), // Page description
    url: z.url().optional(), // Published page URL
    published_at: z.iso.datetime({ offset: true }).optional(), // Publication timestamp
    unpublished_at: z.iso.datetime({ offset: true }).optional(), // Unpublication timestamp
    status: z.string(), // Publication status
    list_id: z.string().optional(), // Associated list ID
    visits: z.number().min(0).optional(), // Total page visits
    unique_visits: z.number().min(0).optional(), // Unique visitor count
    subscribes: z.number().min(0).optional(), // Number of subscribes
    clicks: z.number().min(0).optional(), // Total clicks
    conversion_rate: z.number().min(0).max(100).optional(), // Conversion rate percentage
    timeseries: landingPageReportTimeseriesSchema.optional(), // Time-based performance data
    ecommerce: landingPageReportEcommerceSchema.optional(), // E-commerce metrics
    web_id: z.number().int().min(0).optional(), // Web ID for the landing page
    list_name: z.string().optional(), // Associated list name
    signup_tags: z
      .array(
        z.object({
          tag_id: z.number().int().min(0), // Tag ID
          tag_name: z.string(), // Tag name
        }),
      )
      .optional(), // Tags applied to signups
    _links: z.array(linkSchema).optional(), // HATEOAS navigation links
  })
  .strict(); // Ensures no extra fields are present
