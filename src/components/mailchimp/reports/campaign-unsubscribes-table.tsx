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

interface CampaignUnsubscribesTableProps {
  unsubscribesData: UnsubscribesSuccess;
  currentPage: number;
  pageSize: number;
  perPageOptions: number[];
  baseUrl: string;
  campaignId: string;
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {unsubscribes.map((member) => (
                  <TableRow key={member.email_id}>
                    <TableCell>{member.email_address}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTimeSafe(member.timestamp)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.reason || "N/A"}
                    </TableCell>
                    <TableCell>
                      {member.vip ? (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                          VIP
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
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
