/**
 * List Overview Dashboard Component
 * Displays list data in a table format with pagination controls
 *
 * Following established patterns from reports-overview.tsx
 * Implements component reuse strategy with Table and pagination controls
 */

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "@/components/dashboard/shared/pagination-controls";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { Users, Eye } from "lucide-react";
import Link from "next/link";
import { formatDateShort, useStaticPaginationHandlers } from "@/utils";
import { formatNumber } from "@/utils";
import { ListParamsSchema } from "@/schemas/mailchimp/list-params.schema";
import type { ListOverviewProps } from "@/types/components/mailchimp";

export function ListOverview({
  responseData,
  currentPage = 1,
  pageSize = ListParamsSchema.parse({}).count,
  error = null,
}: ListOverviewProps) {
  // Hooks must be called at the top, before any early returns
  const { handlePageChange, handlePerPageChange } =
    useStaticPaginationHandlers();

  // Handle service-level errors passed from parent
  if (error) {
    return <DashboardInlineError error={error} />;
  }

  // Handle prop validation - no response data provided
  if (!responseData) {
    return <DashboardInlineError error="No list data provided" />;
  }

  const lists = responseData.lists || [];
  const totalCount = responseData.total_items || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Lists Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Lists</span>
            {totalCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalCount.toLocaleString()}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lists.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-8 text-muted-foreground"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <Users
                className="h-8 w-8 mb-2 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="font-semibold text-lg mb-2">No lists found</span>
              <span>
                Create your first list to start building your email lists.
              </span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>List Name</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-right">Open Rate</TableHead>
                    <TableHead className="text-right">Click Rate</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lists.map((list) => (
                    <TableRow key={list.id}>
                      <TableCell className="font-medium max-w-xs">
                        <Link
                          href={`/mailchimp/lists/${list.id}`}
                          className="truncate hover:underline"
                          title={list.name}
                        >
                          {list.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <span>{formatNumber(list.stats.member_count)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            list.visibility === "pub" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {list.visibility === "pub" ? "Public" : "Private"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {list.stats.open_rate
                          ? (list.stats.open_rate * 100).toFixed(1) + "%"
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {list.stats.click_rate
                          ? (list.stats.click_rate * 100).toFixed(1) + "%"
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDateShort(list.date_created)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {lists.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={pageSize}
            options={[10, 25, 50, 100]}
            onChange={handlePerPageChange}
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
