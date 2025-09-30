/**
 * Mailchimp List TypeScript Types
 * Types inferred from Zod schemas for the Mailchimp API lists endpoint
 */
import { z } from "zod";
import type {
  ListSchema,
  ListsSuccessSchema,
  ListContactSchema,
  ListCampaignDefaultsSchema,
  ListStatsSchema,
  LIST_VISIBILITY,
} from "@/schemas/mailchimp/lists-success.schema";

// Nested object types
export type ListContact = z.infer<typeof ListContactSchema>;
export type ListCampaignDefaults = z.infer<typeof ListCampaignDefaultsSchema>;
export type ListStats = z.infer<typeof ListStatsSchema>;

// Main API response types
export type List = z.infer<typeof ListSchema>;
export type ListsSuccess = z.infer<typeof ListsSuccessSchema>;

// List visibility type
export type ListVisibility = (typeof LIST_VISIBILITY)[number];

/**
 * Query parameters for retrieving lists
 */
export interface ListsQuery {
  fields?: string;
  exclude_fields?: string;
  count?: number;
  offset?: number;
  before_date_created?: string;
  since_date_created?: string;
  before_campaign_last_sent?: string;
  since_campaign_last_sent?: string;
  email?: string;
  sort_field?: "date_created" | "member_count";
  sort_dir?: "ASC" | "DESC";
}

/**
 * Aggregate dashboard statistics for lists overview
 * Used for dashboard components showing totals across all lists
 */
export interface DashboardListStats {
  total_audiences: number; // Total number of lists
  total_members: number; // Total members across all lists
  audiences_by_visibility: {
    pub: number; // Number of public lists
    prv: number; // Number of private lists
  };
}
