/**
 * Badge utility functions for consistent badge rendering
 *
 * These utilities provide standardized badge components for common
 * status indicators used across table components.
 */

import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

/**
 * Render a VIP badge for a member
 *
 * @param isVip - Whether the member has VIP status
 * @param variant - Badge variant style ('simple' or 'with-icon')
 * @returns Badge component or null
 *
 * @example
 * ```tsx
 * {getVipBadge(member.vip)} // Simple version
 * {getVipBadge(member.vip, 'with-icon')} // With icon
 * ```
 */
export function getVipBadge(
  isVip: boolean,
  variant: "simple" | "with-icon" = "simple",
) {
  if (!isVip) {
    return null;
  }

  if (variant === "with-icon") {
    return (
      <Badge variant="default" className="flex items-center gap-1 w-fit">
        <User className="h-3 w-3" />
        VIP
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="text-xs">
      VIP
    </Badge>
  );
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
