/**
 * Campaign Unsubscribes Table Component
 * Displays unsubscribed members in a table format
 *
 * Uses shadcn/ui Table component for consistency with reports list page
 * TODO: Add TanStack Table for sorting/filtering (see click-details-content.tsx)
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
import { TableEmptyState } from "@/components/ui/table-empty-state";
import type { UnsubscribesSuccess } from "@/types/mailchimp/unsubscribes";
import { formatDateTimeSafe } from "@/utils/format-date";
import {
  getVipBadge,
  getActiveStatusBadge,
} from "@/components/ui/helpers/badge-utils";
import { formatMergeFields } from "@/utils/mailchimp/merge-fields";

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
  campaignId,
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
            <TableEmptyState message="No unsubscribes found for this campaign." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>List Status</TableHead>
                  <TableHead>VIP</TableHead>
                  <TableHead>Merge Fields</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unsubscribes.map((member) => {
                  const emailActivityUrl = `/mailchimp/reports/${campaignId}/email-activity/${member.email_id}`;

                  return (
                    <TableRow key={member.email_id}>
                      <TableCell className="font-medium max-w-xs">
                        <Link
                          href={emailActivityUrl}
                          className="truncate hover:underline text-primary"
                          title={member.email_address}
                        >
                          {member.email_address}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTimeSafe(member.timestamp)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.reason || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/mailchimp/lists/${member.list_id}`}
                          className="inline-block hover:opacity-80 transition-opacity"
                        >
                          {getActiveStatusBadge(member.list_is_active)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {getVipBadge(member.vip, "with-icon")}
                      </TableCell>
                      <TableCell>
                        {formatMergeFields(member.merge_fields)}
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
              TODO: Add pagination component (total: {total_items} members)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
