import { MAILCHIMP_CAMPAIGN_STATUS } from "@/schemas/mailchimp/campaign-list-response.schema";

/**
 * Type definitions for CampaignStatusBadge component
 */

/**
 * Campaign status type that includes official Mailchimp statuses plus any string for flexibility
 */
export type CampaignStatus =
  | (typeof MAILCHIMP_CAMPAIGN_STATUS)[number]
  | string;

export interface CampaignStatusBadgeProps {
  /**
   * Campaign status from Mailchimp API
   */
  status: string;
  /**
   * Additional CSS classes to apply to the badge
   */
  className?: string;
}
