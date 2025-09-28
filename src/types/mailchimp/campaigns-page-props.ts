/**
 * Mailchimp Campaigns Page Props Types
 * TypeScript type definitions for campaigns page component props
 *
 * Follows PRD guideline: "Define shared types in /src/types (no inline definitions)"
 */

/**
 * Search parameters type for campaigns page
 */
export interface CampaignsPageSearchParams {
  page?: string;
  perPage?: string;
  type?: string;
  before_send_time?: string;
  since_send_time?: string;
}

/**
 * Props interface for Campaigns Page component
 * Based on the mailchimpCampaignsQuerySchema parameters with adaptations
 * for Next.js page components using searchParams pattern
 */
export interface CampaignsPageProps {
  searchParams: Promise<CampaignsPageSearchParams>;
}
