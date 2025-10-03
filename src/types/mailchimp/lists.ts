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
import type { ListsParamsSchema } from "@/schemas/mailchimp/lists-params.schema";

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
 * Inferred from ListsParamsSchema
 */
export type ListsParams = z.infer<typeof ListsParamsSchema>;

// Re-export schema and constants for convenience
export {
  ListsParamsSchema,
  SORT_FIELD,
  LISTS_SORT_DIRECTIONS,
} from "@/schemas/mailchimp/lists-params.schema";

/**
 * Search parameters type for lists page
 * Inferred from ListsParamsSchema with UI-specific pagination fields
 *
 * Note: page/perPage are used in the UI and get transformed to count/offset for the API
 */
export type ListsPageSearchParams = Partial<
  z.infer<typeof ListsParamsSchema>
> & {
  page?: string;
  perPage?: string;
};

/**
 * Props interface for Lists Page component
 */
export interface ListsPageProps {
  searchParams: Promise<ListsPageSearchParams>;
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
