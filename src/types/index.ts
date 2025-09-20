/**
 * Types Index
 * Exports all type definitions from the types directory
 *
 * Following project guidelines for centralized type definitions
 */

// Component types
export * from "@/types/components";

// API Error types
export * from "@/types/api-errors";

// Auth types
export * from "@/types/auth";

// Campaign types
export * from "@/types/campaign-filters";
export * from "@/types/mailchimp-campaigns";

// Mailchimp dashboard component types
export type { MailchimpDashboardCampaign } from "@/types/mailchimp-dashboard";

// All other Mailchimp specific types
export * from "@/types/mailchimp";
