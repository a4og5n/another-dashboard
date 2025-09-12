/**
 * Mailchimp Audiences Page Props Types
 * TypeScript type definitions for audiences page component props
 *
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */

/**
 * Props interface for Audiences Page component
 * Based on the MailchimpAudienceQuerySchema parameters with adaptations
 * for Next.js page components using searchParams pattern
 */
export interface AudiencesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sort?: string;
    order?: string;
    search?: string;
    visibility?: string;
    sync_status?: string;
  }>;
}
