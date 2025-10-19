/**
 * Badge utility functions for consistent badge rendering
 *
 * These utilities provide standardized badge components for common
 * status indicators used across table components.
 */

import { Badge } from "@/components/ui/badge";
import { User, Eye } from "lucide-react";

/**
 * Render a VIP badge for a member
 *
 * @param isVip - Whether the member has VIP status
 * @param variant - Badge variant style ('simple' or 'with-icon')
 * @returns Badge component or null (simple variant returns null for non-VIP)
 *
 * @example
 * ```tsx
 * {getVipBadge(member.vip)} // Simple version - shows badge or null
 * {getVipBadge(member.vip, 'with-icon')} // With icon - shows VIP/No badge
 * ```
 */
export function getVipBadge(
  isVip: boolean,
  variant: "simple" | "with-icon" = "simple",
) {
  if (variant === "with-icon") {
    return isVip ? (
      <Badge variant="default" className="flex items-center gap-1 w-fit">
        <User className="h-3 w-3" />
        VIP
      </Badge>
    ) : (
      <Badge variant="outline">No</Badge>
    );
  }

  // Simple variant: only show badge for VIP users
  return isVip ? (
    <Badge variant="secondary" className="text-xs">
      VIP
    </Badge>
  ) : null;
}

/**
 * Render a status badge for a member subscription status
 *
 * @param status - Member subscription status
 * @returns Badge component with appropriate variant
 *
 * @example
 * ```tsx
 * {getMemberStatusBadge(member.status)}
 * ```
 */
export function getMemberStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "subscribed":
      return <Badge variant="default">Active</Badge>;
    case "unsubscribed":
      return <Badge variant="secondary">Unsubscribed</Badge>;
    case "cleaned":
      return <Badge variant="destructive">Cleaned</Badge>;
    case "pending":
      return <Badge variant="outline">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

/**
 * Render an active/inactive status badge
 *
 * @param isActive - Whether the item is active
 * @returns Badge component
 *
 * @example
 * ```tsx
 * {getActiveStatusBadge(list.is_active)}
 * ```
 */
export function getActiveStatusBadge(isActive: boolean) {
  return isActive ? (
    <Badge variant="default">Active</Badge>
  ) : (
    <Badge variant="secondary">Inactive</Badge>
  );
}

/**
 * Render a visibility badge for list visibility status
 *
 * @param visibility - List visibility ("pub" for public, "prv" for private)
 * @param variant - Badge variant style ('simple' or 'with-icon')
 * @returns Badge component
 *
 * @example
 * ```tsx
 * {getVisibilityBadge(list.visibility)} // Simple version
 * {getVisibilityBadge(list.visibility, 'with-icon')} // With icon
 * ```
 */
export function getVisibilityBadge(
  visibility: "pub" | "prv",
  variant: "simple" | "with-icon" = "simple",
) {
  const isPublic = visibility === "pub";
  const label = isPublic ? "Public" : "Private";

  if (variant === "with-icon") {
    return (
      <Badge
        variant={isPublic ? "default" : "secondary"}
        className="text-xs flex items-center gap-1 w-fit"
      >
        <Eye className="h-3 w-3" />
        {label}
      </Badge>
    );
  }

  // Simple variant
  return (
    <Badge variant={isPublic ? "outline" : "secondary"} className="text-xs">
      {label}
    </Badge>
  );
}

/**
 * Get badge variant for campaign status
 *
 * Utility function that returns just the variant and label for a given campaign status.
 * Use this when you need to render a custom Badge with campaign status styling.
 * For a complete component, use CampaignStatusBadge instead.
 *
 * @param status - Campaign status string from Mailchimp API
 * @returns Object with variant and display label
 *
 * @example
 * ```tsx
 * const { variant, label } = getCampaignStatusBadge(campaign.status);
 * <Badge variant={variant}>{label}</Badge>
 * ```
 */
export function getCampaignStatusBadge(status: string): {
  variant: "default" | "secondary" | "outline" | "destructive";
  label: string;
} {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "sent":
      return { variant: "default", label: "Sent" };
    case "sending":
      return { variant: "secondary", label: "Sending" };
    case "schedule":
      return { variant: "outline", label: "Scheduled" };
    case "save":
      return { variant: "secondary", label: "Draft" };
    case "paused":
      return { variant: "outline", label: "Paused" };
    case "draft":
      return { variant: "outline", label: "Draft" };
    case "canceled":
      return { variant: "outline", label: "Canceled" };
    default:
      return { variant: "outline", label: status };
  }
}
