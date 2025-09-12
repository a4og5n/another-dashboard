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
  getSortedRowModel,
  SortingState,
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
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/dashboard/shared/pagination-controls";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import {
  Mail,
  Eye,
  User,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type {
  ReportOpenListMember,
  CampaignOpensTableProps,
} from "@/types/mailchimp";

export function CampaignOpensTable({
  opensData,
  currentParams,
  perPageOptions = [10, 20, 50],
  onPageChange,
  onPerPageChange,
}: CampaignOpensTableProps) {
  const { members, total_items, total_opens, total_proxy_excluded_opens } =
    opensData;
  const { count, offset } = currentParams;

  // Calculate pagination
  const currentPage = Math.floor(offset / count) + 1;
  const totalPages = Math.ceil(total_items / count);

  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2 lg:px-3"
            >
              Email Address
              {column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-3 w-3" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-3 w-3" />
              ) : (
                <ArrowUpDown className="ml-2 h-3 w-3" />
              )}
            </Button>
          );
        },
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
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2 lg:px-3"
            >
              Status
              {column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-3 w-3" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-3 w-3" />
              ) : (
                <ArrowUpDown className="ml-2 h-3 w-3" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => getStatusBadge(row.getValue("contact_status")),
      },
      {
        accessorKey: "opens_count",
        header: ({ column }) => {
          return (
            <div className="text-right">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-8 px-2 lg:px-3"
              >
                Opens Count
                {column.getIsSorted() === "desc" ? (
                  <ArrowDown className="ml-2 h-3 w-3" />
                ) : column.getIsSorted() === "asc" ? (
                  <ArrowUp className="ml-2 h-3 w-3" />
                ) : (
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                )}
              </Button>
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
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2 lg:px-3"
            >
              Last Opened
              {column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-3 w-3" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-3 w-3" />
              ) : (
                <ArrowUpDown className="ml-2 h-3 w-3" />
              )}
            </Button>
          );
        },
        accessorFn: (row) => {
          const lastOpen = row.opens[row.opens.length - 1];
          return lastOpen ? lastOpen.timestamp : "";
        },
        cell: ({ row }) => {
          const member = row.original;
          const lastOpen = member.opens[member.opens.length - 1];
          return (
            <div className="text-muted-foreground">
              {lastOpen ? formatDate(lastOpen.timestamp) : "—"}
            </div>
          );
        },
      },
      {
        accessorKey: "vip",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2 lg:px-3"
            >
              VIP
              {column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-3 w-3" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-3 w-3" />
              ) : (
                <ArrowUpDown className="ml-2 h-3 w-3" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => getVipBadge(row.getValue("vip")),
      },
    ],
    [],
  );

  // Initialize the table
  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    // Disable built-in pagination since we handle it server-side
    manualPagination: true,
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
                  {total_opens.toLocaleString()}
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
                  {total_proxy_excluded_opens.toLocaleString()}
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
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
            onChange={onPerPageChange || (() => {})}
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}
    </div>
  );
}
