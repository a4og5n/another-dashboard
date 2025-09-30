/**
 * Campaign status types for status badge component
 */

/**
 * Official Mailchimp campaign status values
 * Based on Mailchimp API documentation
 */
export type CampaignStatus =
  | "sent"
  | "sending"
  | "schedule"
  | "save"
  | "paused"
  | "draft"
  | "canceled";

/**
 * Props for CampaignStatusBadge component
 */
export interface CampaignStatusBadgeProps {
  /** Campaign status from Mailchimp API */
  status: string;
  /** Optional additional CSS classes */
  className?: string;
}
