/**
 * Campaign Abuse Reports Table Component
 * Displays a table of abuse/spam complaints for a specific campaign using TanStack Table
 *
 * Following the pattern from CampaignOpensTable with modern table patterns
 * including pagination and responsive design
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
import { formatDateTime } from "@/utils/format-date";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import { Mail, Clock, User, ShieldAlert } from "lucide-react";
import type { AbuseReport } from "@/types/mailchimp";
import type { AbuseReportsTableProps } from "@/types/components/mailchimp/reports";
import { CampaignAbuseReportsEmpty } from "./CampaignAbuseReportsEmpty";

export function CampaignAbuseReportsTable({
  abuseReportsData,
  currentPage,
  pageSize,
  perPageOptions = [...PER_PAGE_OPTIONS],
  baseUrl,
  campaignId,
}: AbuseReportsTableProps) {
  const { abuse_reports, total_items } = abuseReportsData || {};

  // Calculate pagination
  const totalPages = Math.ceil((total_items || 0) / pageSize);

  // Helper functions for URL generation
  const createPageUrl = useCallback(
    (page: number) => {
      const params = new URLSearchParams();
      // Only add page if not page 1
      if (page > 1) {
        params.set("page", page.toString());
      }
      // Add perPage if it's not the default
      if (pageSize !== 10) {
        params.set("perPage", pageSize.toString());
      }
      return `${baseUrl}${params.toString() ? `?${params.toString()}` : ""}`;
    },
    [baseUrl, pageSize],
  );

  const createPerPageUrl = useCallback(
    (newPerPage: number) => {
      const params = new URLSearchParams();
      // Reset to page 1 when changing page size
      // Only add perPage if it's not the default
      if (newPerPage !== 10) {
        params.set("perPage", newPerPage.toString());
      }
      return `${baseUrl}${params.toString() ? `?${params.toString()}` : ""}`;
    },
    [baseUrl],
  );

  // Utility functions
  const getVipBadge = (isVip: boolean) => {
    return isVip ? (
      <Badge variant="default" className="flex items-center gap-1 w-fit">
        <User className="h-3 w-3" />
        VIP
      </Badge>
    ) : (
      <Badge variant="outline">No</Badge>
    );
  };

  const getListStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const formatMergeFields = (
    mergeFields?: Record<string, string | number | unknown>,
  ) => {
    if (!mergeFields || Object.keys(mergeFields).length === 0) {
      return <span className="text-muted-foreground text-sm">—</span>;
    }

    return (
      <div className="space-y-1 max-w-xs">
        {Object.entries(mergeFields).map(([key, value]) => {
          // Handle address objects
          if (typeof value === "object" && value !== null) {
            const addr = value as Record<string, string>;
            const addressStr = [addr.addr1, addr.city, addr.state, addr.zip]
              .filter(Boolean)
              .join(", ");
            return (
              <div key={key} className="text-xs">
                <span className="font-medium">{key}:</span>{" "}
                <span className="text-muted-foreground">{addressStr}</span>
              </div>
            );
          }

          // Handle string/number values
          return (
            <div key={key} className="text-xs">
              <span className="font-medium">{key}:</span>{" "}
              <span className="text-muted-foreground">{String(value)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Column definitions for TanStack Table
  const columns = useMemo<ColumnDef<AbuseReport>[]>(
    () => [
      {
        accessorKey: "email_address",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email Address
          </div>
        ),
        cell: ({ row }) => {
          const emailAddress = row.getValue("email_address") as string;
          const emailId = row.original.email_id;
          const emailActivityUrl = `/mailchimp/reports/${campaignId}/email-activity/${emailId}`;

          return (
            <div className="font-medium max-w-xs">
              <Link
                href={emailActivityUrl}
                className="truncate hover:underline text-primary"
                title={emailAddress}
              >
                {emailAddress}
              </Link>
            </div>
          );
        },
      },
      {
        accessorKey: "date",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Date Reported
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground">
            {formatDateTime(row.getValue("date"))}
          </div>
        ),
      },
      {
        accessorKey: "list_is_active",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center">List Status</div>
        ),
        cell: ({ row }) => {
          const listId = row.original.list_id;
          const isActive = row.getValue("list_is_active") as boolean;
          const badge = getListStatusBadge(isActive);

          return (
            <Link
              href={`/mailchimp/lists/${listId}`}
              className="inline-block hover:opacity-80 transition-opacity"
            >
              {badge}
            </Link>
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
      {
        accessorKey: "merge_fields",
        header: () => (
          <div className="h-8 px-2 lg:px-3 flex items-center">Merge Fields</div>
        ),
        cell: ({ row }) => formatMergeFields(row.getValue("merge_fields")),
      },
    ],
    [campaignId],
  );

  // Initialize the table
  const table = useReactTable({
    data: abuse_reports || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Disable built-in pagination since we handle it server-side
    manualPagination: true,
    pageCount: totalPages,
  });

  // Defensive checks for data structure (after all hooks)
  if (!abuseReportsData) {
    return <CampaignAbuseReportsEmpty campaignId={campaignId} />;
  }

  // Validate abuse_reports array
  if (!Array.isArray(abuse_reports)) {
    return <CampaignAbuseReportsEmpty campaignId={campaignId} />;
  }

  // Handle empty state when there are no abuse reports
  if (total_items === 0) {
    return <CampaignAbuseReportsEmpty campaignId={campaignId} />;
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">
                {total_items.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Total Abuse Reports
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abuse Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShieldAlert className="h-5 w-5" />
            <span>Abuse Reports</span>
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
                        <ShieldAlert
                          className="h-8 w-8 mb-2 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <span className="font-semibold text-lg mb-2">
                          No abuse reports found
                        </span>
                        <span>This campaign has no spam complaints.</span>
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
