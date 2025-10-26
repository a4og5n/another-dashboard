/**
 * Member Activity Content Component
 * Displays member activity feed (opens, clicks, bounces, etc.) in a table format
 *
 * Uses shadcn/ui Table component for consistency
 * Server component with URL-based pagination
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MemberActivitySuccess } from "@/types/mailchimp/member-activity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { createPaginationUrls } from "@/utils/pagination/url-generators";
import { formatDateTimeSafe } from "@/utils/format-date";
import Link from "next/link";
import {
  Mail,
  MousePointerClick,
  AlertCircle,
  UserX,
  Send,
  MessageSquare,
  FileText,
  ShoppingCart,
  UserPlus,
  BadgeCheck,
  Calendar,
} from "lucide-react";

interface MemberActivityContentProps {
  data: MemberActivitySuccess;
  listId: string;
  subscriberHash: string;
  currentPage: number;
  pageSize: number;
}

/**
 * Get icon for activity type
 */
function getActivityIcon(activityType: string) {
  switch (activityType) {
    case "open":
      return <Mail className="h-4 w-4" />;
    case "click":
      return <MousePointerClick className="h-4 w-4" />;
    case "bounce":
      return <AlertCircle className="h-4 w-4" />;
    case "unsub":
      return <UserX className="h-4 w-4" />;
    case "sent":
      return <Send className="h-4 w-4" />;
    case "conversation":
      return <MessageSquare className="h-4 w-4" />;
    case "note":
      return <FileText className="h-4 w-4" />;
    case "order":
      return <ShoppingCart className="h-4 w-4" />;
    case "marketing_permission":
      return <BadgeCheck className="h-4 w-4" />;
    case "postcard_sent":
      return <Calendar className="h-4 w-4" />;
    default:
      return <UserPlus className="h-4 w-4" />;
  }
}

/**
 * Get badge variant for activity type
 */
function getActivityBadgeVariant(
  activityType: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (activityType) {
    case "bounce":
      return "destructive";
    case "unsub":
      return "destructive";
    case "open":
    case "click":
      return "default";
    case "sent":
      return "secondary";
    default:
      return "outline";
  }
}

/**
 * Format activity type for display
 */
function formatActivityType(activityType: string): string {
  const typeMap: Record<string, string> = {
    open: "Open",
    click: "Click",
    bounce: "Bounce",
    unsub: "Unsubscribe",
    sent: "Sent",
    conversation: "Conversation",
    note: "Note",
    marketing_permission: "Marketing Permission",
    postcard_sent: "Postcard Sent",
    squatter_signup: "Squatter Signup",
    website_signup: "Website Signup",
    landing_page_signup: "Landing Page Signup",
    ecommerce_signup: "E-commerce Signup",
    generic_signup: "Signup",
    order: "Order",
    event: "Event",
    survey_response: "Survey Response",
  };
  return typeMap[activityType] || activityType;
}

/**
 * Get activity details for display
 */
function getActivityDetails(
  activity: MemberActivitySuccess["activity"][number],
): string {
  switch (activity.activity_type) {
    case "click":
      return activity.link_clicked || "Link clicked";
    case "bounce":
      return `${activity.bounce_type || "unknown"} bounce`;
    case "unsub":
      return activity.unsubscribe_reason || "Unsubscribed";
    case "conversation":
      return activity.message_text?.substring(0, 50) + "..." || "Message";
    case "note":
      return activity.note_text?.substring(0, 50) + "..." || "Note added";
    case "open":
    case "sent":
      return activity.campaign_title || "—";
    default:
      // For generic activity types, try to get campaign_title if it exists
      return (
        ("campaign_title" in activity &&
          typeof activity.campaign_title === "string" &&
          activity.campaign_title) ||
        "—"
      );
  }
}

/**
 * Extract date in YYYY-MM-DD format from ISO 8601 timestamp
 * Converts to local timezone before extracting date to handle timezone offsets correctly
 * @param timestamp - ISO 8601 timestamp string (e.g., "2025-10-22T22:31:00-07:00")
 * @returns Date string in YYYY-MM-DD format (e.g., "2025-10-22")
 */
function extractLocalDateString(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function MemberActivityContent({
  data,
  listId,
  subscriberHash,
  currentPage,
  pageSize,
}: MemberActivityContentProps) {
  const { activity } = data;
  const itemsOnCurrentPage = activity.length;

  // Since the API doesn't return total_items, we determine if there are more pages
  // by checking if we got a full page of results
  const hasFullPage = itemsOnCurrentPage === pageSize;
  const hasNextPage = hasFullPage; // If we got a full page, there might be more
  const hasPrevPage = currentPage > 1;
  const showPagination = hasNextPage || hasPrevPage;

  // Base URL for pagination
  const baseUrl = `/mailchimp/lists/${listId}/members/${subscriberHash}/activity`;

  // URL generators for server-side pagination
  const { createPageUrl, createPerPageUrl } = createPaginationUrls(
    baseUrl,
    pageSize,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Activity Feed
            {itemsOnCurrentPage > 0 &&
              ` (showing ${itemsOnCurrentPage.toLocaleString()} ${itemsOnCurrentPage === 1 ? "event" : "events"})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No activity found for this member.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity Type</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity.map((event, index) => (
                  <TableRow
                    key={`${event.activity_type}-${event.created_at_timestamp}-${index}`}
                  >
                    <TableCell>
                      <Badge
                        variant={getActivityBadgeVariant(event.activity_type)}
                        className="flex items-center gap-1 w-fit"
                      >
                        {getActivityIcon(event.activity_type)}
                        {formatActivityType(event.activity_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {(() => {
                        const hasTitle =
                          "campaign_title" in event &&
                          typeof event.campaign_title === "string" &&
                          event.campaign_title;
                        const hasId =
                          "campaign_id" in event &&
                          typeof event.campaign_id === "string" &&
                          event.campaign_id;

                        if (hasTitle && hasId) {
                          return (
                            <Link
                              href={`/mailchimp/reports/${event.campaign_id}`}
                              className="text-primary hover:underline"
                            >
                              {event.campaign_title as string}
                            </Link>
                          );
                        }

                        return hasTitle
                          ? (event.campaign_title as string)
                          : "—";
                      })()}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {getActivityDetails(event)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {(() => {
                        const dateOnly = extractLocalDateString(
                          event.created_at_timestamp,
                        );
                        return (
                          <Link
                            href={`/mailchimp/reports?from=${dateOnly}&to=${dateOnly}`}
                            className="text-primary hover:underline transition-colors"
                          >
                            {formatDateTimeSafe(event.created_at_timestamp)}
                          </Link>
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {showPagination && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={pageSize}
            options={[10, 25, 50, 100]}
            createPerPageUrl={createPerPageUrl}
            itemName="events per page"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrevPage}
              asChild={hasPrevPage}
            >
              {hasPrevPage ? (
                <a href={createPageUrl(currentPage - 1)}>Previous</a>
              ) : (
                <span>Previous</span>
              )}
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              asChild={hasNextPage}
            >
              {hasNextPage ? (
                <a href={createPageUrl(currentPage + 1)}>Next</a>
              ) : (
                <span>Next</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
