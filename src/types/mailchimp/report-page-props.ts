/**
 * Mailchimp Report Page Props Types
 * TypeScript type definitions for report page component props
 *
 * Issue #135: Report detail page props types
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */

/**
 * Props interface for Report Page component
 */
export interface ReportPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    fields?: string;
    exclude_fields?: string;
  }>;
}
