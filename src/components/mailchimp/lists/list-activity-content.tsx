/**
 * List Activity Content Component
 * Displays daily list activity timeline with engagement metrics
 *
 * Uses shadcn/ui Table component for consistency
 * Shows daily activity: emails sent, opens, clicks, bounces, subs/unsubs
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
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import type { ListActivityResponse } from "@/types/mailchimp";
import { formatDateShort } from "@/utils/format-date";

interface ListActivityContentProps {
  data: ListActivityResponse;
  listId: string;
  currentPage: number;
  pageSize: number;
}

export function ListActivityContent({
  data,
  listId,
  currentPage,
  pageSize,
}: ListActivityContentProps) {
  const { activity, total_items } = data;
  const baseUrl = `/mailchimp/lists/${listId}/activity`;

  // URL generation functions
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("perPage", pageSize.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const createPerPageUrl = (newPerPage: number) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("perPage", newPerPage.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Daily Activity ({total_items.toLocaleString()}{" "}
            {total_items === 1 ? "day" : "days"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No activity data available for this list.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Emails Sent</TableHead>
                    <TableHead className="text-right">Opens</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Hard Bounces</TableHead>
                    <TableHead className="text-right">Soft Bounces</TableHead>
                    <TableHead className="text-right">Subs</TableHead>
                    <TableHead className="text-right">Unsubs</TableHead>
                    <TableHead className="text-right">Other Adds</TableHead>
                    <TableHead className="text-right">Other Removes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activity.map((item, index) => (
                    <TableRow key={`${item.day}-${index}`}>
                      <TableCell className="font-medium">
                        {formatDateShort(item.day)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.emails_sent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.unique_opens.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.recipient_clicks.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.hard_bounce.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.soft_bounce.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.subs.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.unsubs.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.other_adds.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.other_removes.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-4">
                <PerPageSelector
                  value={pageSize}
                  createPerPageUrl={createPerPageUrl}
                  itemName="days"
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(total_items / pageSize)}
                  createPageUrl={createPageUrl}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
