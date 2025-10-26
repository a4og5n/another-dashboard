/**
 * Segment Members Content Component
 * Displays segment members in a table format
 *
 * Uses shadcn/ui Table component for consistency
 * Shows member details: email, status, rating, email client, language, engagement stats
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
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { z } from "zod";
import type { segmentMembersSuccessSchema } from "@/schemas/mailchimp/lists/segments/members/success.schema";
import { createPaginationUrls } from "@/utils/pagination/url-generators";

type SegmentMembersResponse = z.infer<typeof segmentMembersSuccessSchema>;

interface SegmentMembersContentProps {
  data: SegmentMembersResponse;
  listId: string;
  segmentId: string;
  currentPage: number;
  pageSize: number;
}

/**
 * Get badge variant for member status
 */
function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "subscribed":
      return "default"; // Active/subscribed members
    case "unsubscribed":
      return "destructive"; // Unsubscribed
    case "cleaned":
      return "secondary"; // Cleaned/bounced
    case "pending":
      return "outline"; // Pending confirmation
    case "transactional":
      return "outline"; // Transactional
    case "archived":
      return "secondary"; // Archived
    default:
      return "default";
  }
}

/**
 * Render star rating
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3 w-3 ${
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
          }`}
        />
      ))}
    </div>
  );
}

export function SegmentMembersContent({
  data,
  listId,
  segmentId,
  currentPage,
  pageSize,
}: SegmentMembersContentProps) {
  const { members, total_items } = data;
  const baseUrl = `/mailchimp/lists/${listId}/segments/${segmentId}/members`;

  // URL generators for server-side pagination
  const { createPageUrl, createPerPageUrl } = createPaginationUrls(
    baseUrl,
    pageSize,
  );

  const totalPages = Math.ceil(total_items / pageSize);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Segment Members ({total_items.toLocaleString()}{" "}
            {total_items === 1 ? "member" : "members"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <TableEmptyState message="No members found in this segment." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Email Client</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead className="text-right">Open Rate</TableHead>
                  <TableHead className="text-right">Click Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow key={`${member.id}-${index}`}>
                    <TableCell>
                      <div className="space-y-1">
                        <Link
                          href={`/mailchimp/lists/${listId}/members/${member.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {member.email_address}
                        </Link>
                        {member.full_name && (
                          <div className="text-sm text-muted-foreground">
                            {member.full_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={member.member_rating} />
                    </TableCell>
                    <TableCell>
                      {member.email_client || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {member.language || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {(member.stats.avg_open_rate * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {(member.stats.avg_click_rate * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {total_items > 0 && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={pageSize}
            createPerPageUrl={createPerPageUrl}
            itemName="members"
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            createPageUrl={createPageUrl}
          />
        </div>
      )}
    </div>
  );
}
