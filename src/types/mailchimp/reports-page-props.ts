/**
 * Mailchimp Reports Page Props Types
 * TypeScript type definitions for reports page component props
 *
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */

/**
 * Search parameters type for reports page
 */
export interface ReportsPageSearchParams {
  page?: string;
  perPage?: string;
  type?: string;
  before_send_time?: string;
  since_send_time?: string;
}

/**
 * Props interface for Reports Page component
 * Based on the mailchimpReportsQuerySchema parameters with adaptations
 * for Next.js page components using searchParams pattern
 */
export interface ReportsPageProps {
  searchParams: Promise<ReportsPageSearchParams>;
}
