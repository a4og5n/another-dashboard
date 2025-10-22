/**
 * Campaign Unsubscribes Table Component
 * Displays unsubscribed members in a table format
 *
 * Uses shadcn/ui Table component for consistency with reports list page
 * TODO: Add TanStack Table for sorting/filtering (see click-details-content.tsx)
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
import type { UnsubscribesSuccess } from "@/types/mailchimp/unsubscribes";
import { formatDateTimeSafe } from "@/utils/format-date";
import { getVipBadge } from "@/components/ui/helpers/badge-utils";

interface CampaignUnsubscribesTableProps {
  unsubscribesData: UnsubscribesSuccess;
  currentPage: number;
  pageSize: number;
  perPageOptions: number[];
  baseUrl: string;
  campaignId: string;
}

/**
 * Format merge fields for display in table cell
 * Follows the same pattern as CampaignAbuseReportsTable
 */
function formatMergeFields(
  mergeFields?: Record<string, string | number | unknown>,
) {
  if (!mergeFields || Object.keys(mergeFields).length === 0) {
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  return (
    <div className="space-y-1 max-w-xs">
      {Object.entries(mergeFields).map(([key, value]) => {
        // Handle address objects
        if (typeof value === "object" && value !== null) {
          const addr = value as Record<string, string>;
          const addressStr = [addr.addr1, addr.city, addr.state, addr.zip]
            .filter(Boolean)
            .join(", ");
          return (
            <div key={key} className="text-xs">
              <span className="font-medium">{key}:</span>{" "}
              <span className="text-muted-foreground">{addressStr}</span>
            </div>
          );
        }

        // Handle string/number values
        return (
          <div key={key} className="text-xs">
            <span className="font-medium">{key}:</span>{" "}
            <span className="text-muted-foreground">{String(value)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function CampaignUnsubscribesTable({
  unsubscribesData,
}: CampaignUnsubscribesTableProps) {
  const { unsubscribes, total_items } = unsubscribesData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unsubscribed Members ({total_items})</CardTitle>
        </CardHeader>
        <CardContent>
          {unsubscribes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No unsubscribes found for this campaign.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>VIP</TableHead>
                  <TableHead>Merge Fields</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unsubscribes.map((member) => (
                  <TableRow key={member.email_id}>
                    <TableCell className="font-medium">
                      {member.email_address}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTimeSafe(member.timestamp)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.reason || "N/A"}
                    </TableCell>
                    <TableCell>
                      {getVipBadge(member.vip, "with-icon")}
                    </TableCell>
                    <TableCell>
                      {formatMergeFields(member.merge_fields)}
                    </TableCell>
                  </TableRow>
                ))}
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
              TODO: Add pagination component (total: {total_items} members)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
