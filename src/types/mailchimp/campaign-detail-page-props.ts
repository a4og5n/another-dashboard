/**
 * Campaign Detail Page Props Types
 * Type definitions for the campaign detail page component props
 *
 * Issue #136: Campaign detail page type definitions
 * Following project type organization patterns
 */

export interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fields?: string; exclude_fields?: string }>;
}
