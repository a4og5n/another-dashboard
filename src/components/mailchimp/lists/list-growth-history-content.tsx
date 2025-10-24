/**
 * List Growth History Content Component
 * Displays monthly list growth data in a table format
 *
 * Uses shadcn/ui Table component for consistency
 * Shows monthly growth: subscribed, unsubscribed, cleaned, pending, deleted, etc.
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
import { TableEmptyState } from "@/components/ui/table-empty-state";
import type { GrowthHistoryResponse } from "@/types/mailchimp";
import { createPaginationUrls } from "@/utils/pagination/url-generators";

interface ListGrowthHistoryContentProps {
  data: GrowthHistoryResponse;
  listId: string;
  currentPage: number;
  pageSize: number;
}

/**
 * Format month string from YYYY-MM to readable format
 * @param month - Month string in "YYYY-MM" format
 * @returns Formatted month like "January 2024"
 */
function formatMonth(month: string): string {
  try {
    // Parse YYYY-MM format
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return month; // Fallback to original if parsing fails
  }
}

export function ListGrowthHistoryContent({
  data,
  listId,
  currentPage,
  pageSize,
}: ListGrowthHistoryContentProps) {
  const { history, total_items } = data;
  const baseUrl = `/mailchimp/lists/${listId}/growth-history`;

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
            Monthly Growth ({total_items.toLocaleString()}{" "}
            {total_items === 1 ? "month" : "months"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <TableEmptyState message="No growth history data available for this list." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Subscribed</TableHead>
                  <TableHead className="text-right">Unsubscribed</TableHead>
                  <TableHead className="text-right">Reconfirm</TableHead>
                  <TableHead className="text-right">Cleaned</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead className="text-right">Deleted</TableHead>
                  <TableHead className="text-right">Transactional</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item, index) => (
                  <TableRow key={`${item.month}-${index}`}>
                    <TableCell className="font-medium">
                      {formatMonth(item.month)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.subscribed.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.unsubscribed.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.reconfirm.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.cleaned.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.pending.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.deleted.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.transactional.toLocaleString()}
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
            itemName="months"
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
