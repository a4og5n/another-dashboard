/**
 * Mailchimp API Root Success Response Schema
 * Schema for the API root endpoint that returns account information
 * and links to all other resources available in the API
 *
 * Issue #118: API Root response structure validation
 * Issue #126: DRY refactoring - now uses common link schema
 * Endpoint: GET /
 * Documentation: https://mailchimp.com/developer/marketing/api/root/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Schema for account contact information
 */
export const rootContactSchema = z.object({
  company: z.string(), // Company name
  addr1: z.string(), // Address line 1
  addr2: z.string(), // Address line 2
  city: z.string(), // City
  state: z.string(), // State/province
  zip: z.string(), // ZIP/postal code
  country: z.string(), // Country code
});

/**
 * Schema for industry statistics
 */
export const rootIndustryStatsSchema = z.object({
  open_rate: z.number(), // Industry average open rate
  bounce_rate: z.number(), // Industry average bounce rate
  click_rate: z.number(), // Industry average click rate
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
 * Main API Root response schema
 */
export const rootSuccessSchema = z.object({
  account_id: z.string().min(1), // Account ID
  login_id: z.string().min(1), // Login ID
  account_name: z.string(), // Account name
  email: z.email(), // Account email address
  first_name: z.string(), // Account owner first name
  last_name: z.string(), // Account owner last name
  username: z.string(), // Mailchimp username
  avatar_url: z.url(), // Avatar image URL
  role: z.string(), // User role in account
  member_since: z.iso.datetime({ offset: true }), // Account creation date (ISO 8601)
  pricing_plan_type: z.enum(PRICING_PLAN_TYPES), // Current pricing plan type
  first_payment: z.iso.datetime({ offset: true }), // First payment date (ISO 8601)
  account_timezone: z.string(), // Account timezone
  account_industry: z.string(), // Industry category
  contact: rootContactSchema, // Contact information
  pro_enabled: z.boolean(), // Whether pro features are enabled
  last_login: z.iso.datetime({ offset: true }), // Last login date (ISO 8601)
  total_subscribers: z.number().min(0), // Total subscribers across all lists
  industry_stats: rootIndustryStatsSchema, // Industry benchmark statistics
  _links: z.array(linkSchema), // HATEOAS navigation links
});
