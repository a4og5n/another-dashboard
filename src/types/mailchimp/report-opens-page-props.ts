/**
 * Mailchimp Report Opens Page Props Types
 * TypeScript type definitions for report opens page component props
 *
 * Issue #135: Report opens list page props types
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */

import type {
  ReportOpenListSuccess,
  OpenListQueryParams,
} from "@/types/mailchimp";

/**
 * Props interface for Report Opens Page component
 */
export interface ReportOpensPageProps {
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
 * Props interface for Report Opens Table component
 */
export interface ReportOpensTableProps {
  opensData: ReportOpenListSuccess;
  currentParams: OpenListQueryParams & { count: number; offset: number };
  perPageOptions?: number[];
  baseUrl: string; // Base URL for navigation (replaces callback functions)
}
