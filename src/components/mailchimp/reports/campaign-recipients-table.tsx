/**
 * Campaign Recipients Table Component
 * Displays campaign recipients (sent-to members) in a table format
 *
 * Uses shadcn/ui Table component for consistency with other report pages
 * Shows delivery status, open count, and A/B split tracking
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
import type { SentToSuccess } from "@/types/mailchimp/sent-to";
import { formatDateTimeSafe } from "@/utils/format-date";
import {
  getVipBadge,
  getActiveStatusBadge,
} from "@/components/ui/helpers/badge-utils";
import { formatMergeFields } from "@/utils/mailchimp/merge-fields";

interface CampaignRecipientsTableProps {
  recipientsData: SentToSuccess;
  currentPage: number;
  pageSize: number;
  perPageOptions: number[];
  baseUrl: string;
  campaignId: string;
}

/**
 * Get badge for delivery status
 * Maps sent-to status to appropriate badge variant
 */
function getDeliveryStatusBadge(status: string) {
  switch (status) {
    case "sent":
      return (
        <Badge variant="default" className="bg-green-500">
          Sent
        </Badge>
      );
    case "hard":
      return (
        <Badge variant="destructive" title="Hard bounce">
          Hard Bounce
        </Badge>
      );
    case "soft":
      return (
        <Badge variant="outline" title="Soft bounce">
          Soft Bounce
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

/**
 * Get badge for A/B split group
 */
function getAbSplitBadge(group?: string) {
  if (!group) {
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  const colors = {
    a: "bg-blue-500",
    b: "bg-purple-500",
    winner: "bg-yellow-500",
  };

  const color = colors[group as keyof typeof colors] || "bg-gray-500";

  return (
    <Badge variant="default" className={color}>
      {group.toUpperCase()}
    </Badge>
  );
}

export function CampaignRecipientsTable({
  recipientsData,
  campaignId,
}: CampaignRecipientsTableProps) {
  const { sent_to, total_items } = recipientsData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Campaign Recipients ({total_items.toLocaleString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sent_to.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No recipients found for this campaign.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Opens</TableHead>
                  <TableHead>Last Open</TableHead>
                  <TableHead>A/B Group</TableHead>
                  <TableHead>List Status</TableHead>
                  <TableHead>VIP</TableHead>
                  <TableHead>Merge Fields</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sent_to.map((member) => {
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
                      <TableCell>
                        {getDeliveryStatusBadge(member.status)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.open_count}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.last_open
                          ? formatDateTimeSafe(member.last_open)
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {getAbSplitBadge(member.absplit_group)}
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
              TODO: Add pagination component (total:{" "}
              {total_items.toLocaleString()} recipients)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
