/**
 * Campaign Email Activity Table Component
 * Displays email activity (opens, clicks, bounces) in a table format
 *
 * Uses shadcn/ui Table component for consistency with reports list page
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { EmailActivitySuccess } from "@/types/mailchimp/email-activity";
import { formatDateTimeSafe } from "@/utils/format-date";
import { MousePointerClick, Mail, AlertCircle } from "lucide-react";

interface CampaignEmailActivityTableProps {
  emailActivityData: EmailActivitySuccess;
  currentPage: number;
  pageSize: number;
  perPageOptions: number[];
  baseUrl: string;
  campaignId: string;
}

/**
 * Get icon and color for activity action type
 */
function getActionIcon(action: string) {
  switch (action) {
    case "open":
      return <Mail className="h-3 w-3" />;
    case "click":
      return <MousePointerClick className="h-3 w-3" />;
    case "bounce":
      return <AlertCircle className="h-3 w-3" />;
    default:
      return null;
  }
}

/**
 * Get badge variant for activity action
 */
function getActionBadgeVariant(action: string) {
  switch (action) {
    case "open":
      return "default";
    case "click":
      return "secondary";
    case "bounce":
      return "destructive";
    default:
      return "outline";
  }
}

/**
 * Format activity events for display
 */
function formatActivityEvents(
  activity: Array<{
    action: string;
    type?: string;
    timestamp: string;
    url?: string;
    ip?: string;
  }>,
) {
  if (!activity || activity.length === 0) {
    return <span className="text-muted-foreground text-sm">No activity</span>;
  }

  return (
    <div className="space-y-1">
      {activity.slice(0, 3).map((event, index) => (
        <div key={index} className="flex items-center gap-2">
          <Badge
            variant={getActionBadgeVariant(event.action)}
            className="flex items-center gap-1 text-xs"
          >
            {getActionIcon(event.action)}
            {event.action}
            {event.type && ` (${event.type})`}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDateTimeSafe(event.timestamp)}
          </span>
        </div>
      ))}
      {activity.length > 3 && (
        <span className="text-xs text-muted-foreground">
          +{activity.length - 3} more
        </span>
      )}
    </div>
  );
}

export function CampaignEmailActivityTable({
  emailActivityData,
  campaignId: _campaignId,
}: CampaignEmailActivityTableProps) {
  const { emails, total_items } = emailActivityData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Activity ({total_items})</CardTitle>
        </CardHeader>
        <CardContent>
          {emails.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No email activity found for this campaign.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Total Events</TableHead>
                  <TableHead>List</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => {
                  // Count activity types
                  const opens = email.activity.filter(
                    (a) => a.action === "open",
                  ).length;
                  const clicks = email.activity.filter(
                    (a) => a.action === "click",
                  ).length;
                  const bounces = email.activity.filter(
                    (a) => a.action === "bounce",
                  ).length;

                  return (
                    <TableRow key={email.email_id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="space-y-1">
                          <div className="truncate" title={email.email_address}>
                            {email.email_address}
                          </div>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            {opens > 0 && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {opens}
                              </span>
                            )}
                            {clicks > 0 && (
                              <span className="flex items-center gap-1">
                                <MousePointerClick className="h-3 w-3" />{" "}
                                {clicks}
                              </span>
                            )}
                            {bounces > 0 && (
                              <span className="flex items-center gap-1 text-destructive">
                                <AlertCircle className="h-3 w-3" /> {bounces}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        {formatActivityEvents(email.activity)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {email.activity.length}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/mailchimp/lists/${email.list_id}`}
                          className="text-primary hover:underline text-sm"
                        >
                          View List
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* TODO: Add pagination component when needed */}
      {total_items > 10 && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground text-center">
              TODO: Add pagination component (total: {total_items} emails)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
