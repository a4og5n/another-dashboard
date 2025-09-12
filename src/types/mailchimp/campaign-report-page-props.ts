/**
 * Mailchimp Campaign Report Page Props Types
 * TypeScript type definitions for campaign report page component props
 *
 * Issue #135: Campaign report detail page props types
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */

/**
 * Props interface for Campaign Report Page component
 */
export interface CampaignReportPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    fields?: string;
    exclude_fields?: string;
  }>;
}
