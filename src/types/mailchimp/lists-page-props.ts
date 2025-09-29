/**
 * Mailchimp Lists Page Props Types
 * TypeScript type definitions for lists page component props
 *
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */

/**
 * Search parameters type for lists page
 */
export interface ListsPageSearchParams {
  page?: string;
  limit?: string;
  sort?: string;
  order?: string;
  search?: string;
  visibility?: string;
  sync_status?: string;
}

/**
 * Props interface for Lists Page component
 * Based on the MailchimpListQuerySchema parameters with adaptations
 * for Next.js page components using searchParams pattern
 */
export interface ListsPageProps {
  searchParams: Promise<ListsPageSearchParams>;
}
