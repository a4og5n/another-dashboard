/**
 * Campaign Click Details Content Component
 * Displays URLs clicked in a campaign with pagination using TanStack Table
 *
 * @route /mailchimp/reports/[id]/clicks
 */

"use client";

import React, { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MailchimpConnectionGuard } from "@/components/mailchimp/mailchimp-connection-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { formatDateTime } from "@/utils/format-date";
import { MousePointerClick } from "lucide-react";
import type { z } from "zod";
import type {
  reportClickListSuccessSchema,
  urlClickedSchema,
} from "@/schemas/mailchimp/report-click-details-success.schema";

type ClickListSuccess = z.infer<typeof reportClickListSuccessSchema>;
type UrlClicked = z.infer<typeof urlClickedSchema>;

interface ClickDetailsContentProps {
  clicksData: ClickListSuccess | null;
  campaignId: string;
  currentPage: number;
  pageSize: number;
  errorCode?: string;
}

export function ClickDetailsContent({
  clicksData,
  campaignId,
  currentPage,
  pageSize,
  errorCode,
}: ClickDetailsContentProps) {
  const { urls_clicked, total_items } = clicksData || {};

  // Calculate pagination
  const totalPages = Math.ceil((total_items || 0) / pageSize);
  const baseUrl = `/mailchimp/reports/${campaignId}/clicks`;

  // Use shared pagination hook for URL generation
  const { createPageUrl, createPerPageUrl } = useTablePagination({
    baseUrl,
    pageSize,
  });

  // Column definitions for TanStack Table
  const columns = useMemo<ColumnDef<UrlClicked>[]>(
    () => [
      {
        accessorKey: "url",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center">URL</div>
        ),
        cell: ({ row }) => (
          <div className="max-w-md">
            <div className="text-sm truncate" title={row.getValue("url")}>
              {row.getValue("url")}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "total_clicks",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center justify-end text-right">
            Total Clicks
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span className="font-mono">
              {row.getValue<number>("total_clicks").toLocaleString()}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "unique_clicks",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center justify-end text-right">
            Unique Clicks
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span className="font-mono">
              {row.getValue<number>("unique_clicks").toLocaleString()}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "click_percentage",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center justify-end text-right">
            Click %
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span className="font-mono">
              {row.getValue<number>("click_percentage").toFixed(2)}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: "unique_click_percentage",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center justify-end text-right">
            Unique %
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span className="font-mono">
              {row.getValue<number>("unique_click_percentage").toFixed(2)}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: "last_click",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center">Last Click</div>
        ),
        cell: ({ row }) => {
          const lastClick = row.getValue<string>("last_click");
          return (
            <div className="text-muted-foreground text-sm">
              {lastClick ? formatDateTime(lastClick) : "N/A"}
            </div>
          );
        },
      },
    ],
    [],
  );

  // Initialize the table
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table returns functions that cannot be memoized, which is expected
  const table = useReactTable({
    data: urls_clicked || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Disable built-in pagination and sorting since we handle both server-side
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
  });

  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      {!clicksData ? (
        <DashboardInlineError error="Failed to load click details" />
      ) : (
        <>
          {/* Click Details Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointerClick className="h-5 w-5" />
                Click Details
                <span className="text-sm font-normal text-muted-foreground">
                  ({total_items?.toLocaleString() || 0} URLs)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="px-2">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel()?.rows?.length ? (
                      table.getRowModel()?.rows?.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="px-2">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <MousePointerClick className="h-12 w-12 mb-3 opacity-50" />
                            <p>No click data available for this campaign</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination Controls */}
          {total_items && total_items > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <PerPageSelector
                value={pageSize}
                options={[...PER_PAGE_OPTIONS]}
                createPerPageUrl={createPerPageUrl}
              />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  createPageUrl={createPageUrl}
                />
              )}
            </div>
          )}
        </>
      )}
    </MailchimpConnectionGuard>
  );
}
