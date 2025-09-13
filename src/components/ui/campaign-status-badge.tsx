import { Badge } from "@/components/ui/badge";
import type {
  CampaignStatusBadgeProps,
  CampaignStatus,
} from "@/types/components/ui/campaign-status-badge";

/**
 * Displays a styled badge for campaign status with consistent visual mapping.
 * Uses official Mailchimp campaign status values with fallback for unknown statuses.
 *
 * @param status - Campaign status string from Mailchimp API
 * @param className - Optional additional CSS classes
 * @returns A styled Badge component representing the campaign status
 *
 * @example
 * ```tsx
 * <CampaignStatusBadge status="sent" />
 * <CampaignStatusBadge status="save" className="ml-2" />
 * ```
 */
export function CampaignStatusBadge({
  status,
  className,
}: CampaignStatusBadgeProps) {
  const normalizedStatus = status.toLowerCase() as CampaignStatus;

  switch (normalizedStatus) {
    case "sent":
      return (
        <Badge variant="default" className={className}>
          Sent
        </Badge>
      );
    case "sending":
      return (
        <Badge variant="secondary" className={className}>
          Sending
        </Badge>
      );
    case "schedule":
      return (
        <Badge variant="outline" className={className}>
          Scheduled
        </Badge>
      );
    case "save":
      return (
        <Badge variant="secondary" className={className}>
          Draft
        </Badge>
      );
    case "paused":
      return (
        <Badge variant="outline" className={className}>
          Paused
        </Badge>
      );
    // Legacy/custom statuses for backwards compatibility
    case "draft":
    case "canceled":
      return (
        <Badge variant="outline" className={className}>
          {normalizedStatus === "draft" ? "Draft" : "Canceled"}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          {status}
        </Badge>
      );
  }
}
