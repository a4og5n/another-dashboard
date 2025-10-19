/**
 * Campaign Opens Table Component
 * Displays a table of members who opened a specific campaign using TanStack Table
 *
 * Issue #135: Campaign opens table implementation with TanStack Table
 * Following modern table patterns with sorting, filtering, and pagination
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { formatDateTime } from "@/utils/format-date";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import { Mail, Eye, User, Clock } from "lucide-react";
import type { ReportOpenListMember } from "@/types/mailchimp";
import type { ReportOpensTableProps } from "@/types/components/mailchimp";
import { CampaignOpensEmpty } from "./CampaignOpensEmpty";
import { useTablePagination } from "@/hooks/use-table-pagination";
import {
  getVipBadge,
  getMemberStatusBadge,
} from "@/components/ui/helpers/badge-utils";

export function CampaignOpensTable({
  opensData,
  currentPage,
  pageSize,
  perPageOptions = [...PER_PAGE_OPTIONS],
  baseUrl,
  campaignId,
}: ReportOpensTableProps) {
  const { members, total_items, total_opens, total_proxy_excluded_opens } =
    opensData || {};

  // Calculate pagination
  const totalPages = Math.ceil((total_items || 0) / pageSize);

  // Use shared pagination hook for URL generation
  const { createPageUrl, createPerPageUrl } = useTablePagination({
    baseUrl,
    pageSize,
  });

  // Column definitions for TanStack Table
  const columns = useMemo<ColumnDef<ReportOpenListMember>[]>(
    () => [
      {
        accessorKey: "email_address",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center">
            Email Address
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium max-w-xs">
            <div className="truncate" title={row.getValue("email_address")}>
              {row.getValue("email_address")}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "contact_status",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center">Status</div>
        ),
        cell: ({ row }) => getMemberStatusBadge(row.getValue("contact_status")),
      },
      {
        accessorKey: "opens_count",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center justify-end text-right">
            Opens Count
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span className="font-mono">{row.getValue("opens_count")}</span>
          </div>
        ),
      },
      {
        id: "last_opened",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center">Last Opened</div>
        ),
        accessorFn: (row) => {
          const lastOpen =
            row.opens && row.opens.length > 0
              ? row.opens[row.opens.length - 1]
              : null;
          return lastOpen ? lastOpen.timestamp : "";
        },
        cell: ({ row }) => {
          const member = row.original;
          const lastOpen =
            member.opens && member.opens.length > 0
              ? member.opens[member.opens.length - 1]
              : null;
          return (
            <div className="text-muted-foreground">
              {lastOpen ? formatDateTime(lastOpen.timestamp) : "—"}
            </div>
          );
        },
      },
      {
        accessorKey: "vip",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center">VIP</div>
        ),
        cell: ({ row }) => getVipBadge(row.getValue("vip")),
      },
    ],
    [],
  );

  // Initialize the table
  const table = useReactTable({
    data: members || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Disable built-in pagination and sorting since we handle both server-side
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
  });

  // Defensive checks for data structure (after all hooks)
  if (!opensData) {
    return <CampaignOpensEmpty campaignId={campaignId} />;
  }

  // Validate members array
  if (!Array.isArray(members)) {
    return <CampaignOpensEmpty campaignId={campaignId} />;
  }

  // Handle empty state when there are no opens
  if (total_items === 0) {
    return <CampaignOpensEmpty campaignId={campaignId} />;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {total_opens?.toLocaleString() ?? "0"}
                </p>
                <p className="text-xs text-muted-foreground">Total Opens</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {total_items.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Unique Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {total_proxy_excluded_opens?.toLocaleString() ?? "0"}
                </p>
                <p className="text-xs text-muted-foreground">Proxy Excluded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opens Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Campaign Opens</span>
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
                      <div
                        className="flex flex-col items-center justify-center py-8 text-muted-foreground"
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        <Eye
                          className="h-8 w-8 mb-2 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <span className="font-semibold text-lg mb-2">
                          No opens found
                        </span>
                        <span>No members have opened this campaign yet.</span>
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
      {total_items > 0 && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={pageSize}
            options={perPageOptions}
            createPerPageUrl={createPerPageUrl}
            itemName="items per page"
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
