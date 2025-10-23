/**
 * Mailchimp API Campaign Domain Performance Success Response Schema
 * Schema for successful responses from the domain performance endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/domain-performance
 * Documentation: https://mailchimp.com/developer/marketing/api/domain-performance-reports/list-domain-performance-stats/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Individual domain performance data schema
 * Represents email provider domain with engagement metrics
 */
export const domainPerformanceItemSchema = z.object({
  domain: z.string(), // Email domain (e.g., "gmail.com", "outlook.com", "yahoo.com")
  emails_sent: z.number().min(0), // Number of emails sent to this domain
  bounces: z.number().min(0), // Number of bounced emails for this domain
  opens: z.number().min(0), // Total opens from this domain
  clicks: z.number().min(0), // Total clicks from this domain
  unsubs: z.number().min(0), // Unsubscribes from this domain
  delivered: z.number().min(0), // Successfully delivered emails to this domain
  emails_pct: z.number().min(0).max(100), // Percentage of total campaign emails to this domain
  bounces_pct: z.number().min(0).max(100), // Bounce rate for this domain
  opens_pct: z.number().min(0).max(100), // Open rate for this domain
  clicks_pct: z.number().min(0).max(100), // Click rate for this domain
  unsubs_pct: z.number().min(0).max(100), // Unsubscribe rate for this domain
});

/**
 * Main domain performance success response schema
 * Contains array of domains with engagement metrics
 */
export const domainPerformanceSuccessSchema = z.object({
  domains: z.array(domainPerformanceItemSchema), // Array of domain performance data
  total_sent: z.number().min(0), // Total emails sent in the campaign
  campaign_id: z.string().min(1), // Campaign ID this data belongs to
  total_items: z.number().min(0), // Total number of domains
  _links: z.array(linkSchema), // HATEOAS links for navigation
});
