import { z } from "zod";
import type { List, DashboardListStats } from "@/types/mailchimp/lists";
import type { listsParamsSchema } from "@/schemas/mailchimp/lists-params.schema";
import type {
  ListPageParams,
  ListPageSearchParams,
} from "@/schemas/components";

// ============================================================================
// Lists Page Props
// ============================================================================

/**
 * Search parameters type for lists page
 * Inferred from listsParamsSchema with UI-specific pagination fields
 *
 * Note: page/perPage are used in the UI and get transformed to count/offset for the API
 */
export type ListsPageSearchParams = Partial<
  z.infer<typeof listsParamsSchema>
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

// ============================================================================
// List Component Props
// ============================================================================

/**
 * Props for ListOverview component
 */
export interface ListOverviewProps {
  data: {
    lists?: List[];
    total_items?: number;
  } | null;
  currentPage?: number;
  pageSize?: number;
  error?: string | null;
  className?: string;
}

/**
 * Props for ListStats component
 */
export interface ListStatsProps {
  stats: DashboardListStats;
  className?: string;
}

// ============================================================================
// List Detail Page Props
// ============================================================================

/**
 * Props interface for List Detail Page component
 */
export interface ListPageProps {
  params: Promise<ListPageParams>;
  searchParams: Promise<ListPageSearchParams>;
}

/**
 * Props for ListDetail component
 */
export interface ListDetailProps {
  list: List | null;
  error?: string | null;
  activeTab?: "overview" | "stats" | "settings";
}
