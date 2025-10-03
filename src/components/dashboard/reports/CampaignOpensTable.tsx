/**
 * Campaign Opens Table Component
 * Displays a table of members who opened a specific campaign using TanStack Table
 *
 * Issue #135: Campaign opens table implementation with TanStack Table
 * Following modern table patterns with sorting, filtering, and pagination
 */

"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { formatDateTime } from "@/utils";
import {
  Mail,
  Eye,
  User,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { ReportOpenListMember } from "@/types/mailchimp";
import type { ReportOpensTableProps } from "@/types/components/mailchimp";

export function CampaignOpensTable({
  opensData,
  currentParams,
  perPageOptions = [10, 20, 50],
  baseUrl,
}: ReportOpensTableProps) {
  const { members, total_items, total_opens, total_proxy_excluded_opens } =
    opensData;
  const { count, offset, sort_field, sort_dir } = currentParams;

  // Calculate pagination
  const currentPage = Math.floor(offset / count) + 1;
  const totalPages = Math.ceil(total_items / count);

  // Helper functions for URL generation
  const createUrl = useCallback(
    (params: Record<string, string | number>) => {
      const searchParams = new URLSearchParams();

      // Set current parameters
      Object.entries(currentParams).forEach(([key, value]) => {
        searchParams.set(key, value.toString());
      });

      // Override with new parameters
      Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, value.toString());
      });

      return `${baseUrl}?${searchParams.toString()}`;
    },
    [baseUrl, currentParams],
  );

  const createSortUrl = useCallback(
    (sortField: "opens_count", sortDir: "ASC" | "DESC") => {
      return createUrl({
        offset: "0", // Reset to first page when sorting
        sort_field: sortField,
        sort_dir: sortDir,
      });
    },
    [createUrl],
  );

  const createPageUrl = (page: number) => {
    const newOffset = (page - 1) * count;
    return createUrl({ offset: newOffset });
  };

  const createPerPageUrl = (newPerPage: number) => {
    return createUrl({
      offset: "0", // Reset to first page
      count: newPerPage,
    });
  };

  // Utility functions
  const getVipBadge = (isVip: boolean) => {
    return isVip ? (
      <Badge variant="secondary" className="text-xs">
        VIP
      </Badge>
    ) : null;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "subscribed":
        return <Badge variant="default">Active</Badge>;
      case "unsubscribed":
        return <Badge variant="secondary">Unsubscribed</Badge>;
      case "cleaned":
        return <Badge variant="destructive">Cleaned</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
        cell: ({ row }) => getStatusBadge(row.getValue("contact_status")),
      },
      {
        accessorKey: "opens_count",
        header: () => {
          const isSorted = sort_field === "opens_count";
          const isDesc = isSorted && sort_dir === "DESC";
          const isAsc = isSorted && sort_dir === "ASC";
          const newDir = isAsc ? "DESC" : "ASC";
          const sortUrl = createSortUrl("opens_count", newDir);

          return (
            <div className="text-right">
              <Link
                href={sortUrl}
                className="h-8 px-2 lg:px-3 flex items-center justify-end hover:bg-accent rounded-md"
              >
                Opens Count
                {isDesc ? (
                  <ArrowDown className="ml-2 h-3 w-3" />
                ) : isAsc ? (
                  <ArrowUp className="ml-2 h-3 w-3" />
                ) : (
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                )}
              </Link>
            </div>
          );
        },
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
          const lastOpen = row.opens[row.opens.length - 1];
          return lastOpen ? lastOpen.timestamp : "";
        },
        cell: ({ row }) => {
          const member = row.original;
          const lastOpen = member.opens[member.opens.length - 1];
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
    [sort_field, sort_dir, createSortUrl],
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
            value={count}
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
