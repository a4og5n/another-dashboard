/**
 * Mailchimp Campaign Opens Page Props Types
 * TypeScript type definitions for campaign opens page component props
 *
 * Issue #135: Campaign opens list page props types
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */

import type {
  ReportOpenListSuccess,
  OpenListQueryParams,
} from "@/types/mailchimp";

/**
 * Props interface for Campaign Opens Page component
 */
export interface CampaignOpensPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    fields?: string;
    exclude_fields?: string;
    count?: string;
    offset?: string;
    since?: string;
    sort_field?: string;
    sort_dir?: "ASC" | "DESC";
  }>;
}

/**
 * Props interface for Campaign Opens Table component
 */
export interface CampaignOpensTableProps {
  opensData: ReportOpenListSuccess;
  currentParams: OpenListQueryParams & { count: number; offset: number };
  perPageOptions?: number[];
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSortChange?: (sortField: string, sortDir: "ASC" | "DESC") => void;
}
