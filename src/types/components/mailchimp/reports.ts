/**
 * Mailchimp Reports Page Props Types
 * TypeScript type definitions for reports page component props
 *
 * Consolidated from multiple files:
 * - reports-page-props.ts
 * - report-page-props.ts
 * - report-opens-page-props.ts
 *
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */

import type {
  ReportOpenListSuccess,
  AbuseReportListSuccess,
} from "@/types/mailchimp";

// ============================================================================
// Reports List Page Props (GET /reports)
// ============================================================================

/**
 * Search parameters type for reports page
 */
export interface ReportsPageSearchParams {
  page?: string;
  perPage?: string;
  type?: string;
  // Direct API params (backward compatibility)
  before_send_time?: string;
  since_send_time?: string;
  // UI-friendly date filters (YYYY-MM-DD format)
  from?: string;
  to?: string;
}

/**
 * Props interface for Reports Page component
 * Based on the mailchimpReportsQuerySchema parameters with adaptations
 * for Next.js page components using searchParams pattern
 */
export interface ReportsPageProps {
  searchParams: Promise<ReportsPageSearchParams>;
}

// ============================================================================
// Single Report Page Props (GET /reports/{campaign_id})
// ============================================================================

/**
 * Props interface for Report Page component
 */
export interface ReportPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    fields?: string;
    exclude_fields?: string;
    tab?: string;
  }>;
}

// ============================================================================
// Report Opens Page Props (GET /reports/{campaign_id}/open-details)
// ============================================================================

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
 * Note: Mailchimp API accepts sort parameters but does not actually sort the data
 */
export interface ReportOpensTableProps {
  opensData: ReportOpenListSuccess;
  currentPage: number;
  pageSize: number;
  perPageOptions?: number[];
  baseUrl: string; // Base URL for navigation (replaces callback functions)
  campaignId: string; // Campaign ID for empty state component
}

// ============================================================================
// Report Abuse Reports Page Props (GET /reports/{campaign_id}/abuse-reports)
// ============================================================================

/**
 * Props interface for Abuse Reports Page component
 */
export interface AbuseReportsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    perPage?: string;
  }>;
}

/**
 * Props interface for Abuse Reports Table component
 */
export interface AbuseReportsTableProps {
  abuseReportsData: AbuseReportListSuccess;
  currentPage: number;
  pageSize: number;
  perPageOptions?: number[];
  baseUrl: string; // Base URL for navigation
  campaignId: string; // Campaign ID for empty state component
}
