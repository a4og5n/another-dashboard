/**
 * Mailchimp List TypeScript Types
 * Types inferred from Zod schemas for the Mailchimp API lists endpoint
 */
import { z } from "zod";
import type {
  listSchema,
  listsSuccessSchema,
  listContactSchema,
  listCampaignDefaultsSchema,
  listStatsSchema,
  LIST_VISIBILITY,
} from "@/schemas/mailchimp/lists-success.schema";
import type { listsParamsSchema } from "@/schemas/mailchimp/lists-params.schema";

// Nested object types
export type ListContact = z.infer<typeof listContactSchema>;
export type ListCampaignDefaults = z.infer<typeof listCampaignDefaultsSchema>;
export type ListStats = z.infer<typeof listStatsSchema>;

// Main API response types
export type List = z.infer<typeof listSchema>;
export type ListsSuccess = z.infer<typeof listsSuccessSchema>;

// List visibility type
export type ListVisibility = (typeof LIST_VISIBILITY)[number];

/**
 * Query parameters for retrieving lists
 * Inferred from listsParamsSchema
 */
export type ListsParams = z.infer<typeof listsParamsSchema>;

// Re-export schema and constants for convenience
export {
  listsParamsSchema,
  SORT_FIELD,
  LISTS_SORT_DIRECTIONS,
} from "@/schemas/mailchimp/lists-params.schema";

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
