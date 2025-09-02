/**
 * Mailchimp API Root Success Response Schema
 * Schema for the API root endpoint that returns account information
 * and links to all other resources available in the API
 *
 * Issue #118: API Root response structure validation
 * Endpoint: GET /
 * Documentation: https://mailchimp.com/developer/marketing/api/root/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Schema for account contact information
 */
export const RootContactSchema = z.object({
  company: z.string(),
  addr1: z.string(),
  addr2: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
});

/**
 * Schema for industry statistics
 */
export const RootIndustryStatsSchema = z.object({
  open_rate: z.number(),
  bounce_rate: z.number(),
  click_rate: z.number(),
});

/**
 * Pricing plan type enum values
 */
export const PRICING_PLAN_TYPES = [
  "monthly",
  "pay_as_you_go",
  "forever_free",
] as const;

/**
 * HTTP methods enum values for API links
 */
export const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
] as const;

/**
 * Schema for API links (_links array items)
 */
export const RootLinkSchema = z.object({
  rel: z.string(),
  href: z.string(),
  targetSchema: z.string(),
  schema: z.string(),
  method: z.enum(HTTP_METHODS),
});

/**
 * Main API Root response schema
 */
export const MailchimpRootSuccessSchema = z.object({
  // String fields
  account_id: z.string(),
  login_id: z.string(),
  account_name: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  avatar_url: z.string(),
  role: z.string(),
  first_payment: z.string(),
  account_timezone: z.string(),
  account_industry: z.string(),
  last_login: z.string(),

  // ISO 8601 date string
  member_since: z.string(), // ISO 8601 format

  // Enum field
  pricing_plan_type: z.enum(PRICING_PLAN_TYPES),

  // Boolean field
  pro_enabled: z.boolean(),

  // Integer field
  total_subscribers: z.number().int(),

  // Object fields
  contact: RootContactSchema,
  industry_stats: RootIndustryStatsSchema,
  _links: RootLinkSchema,
});
