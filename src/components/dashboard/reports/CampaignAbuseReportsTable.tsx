/**
 * Campaign Abuse Reports Table Component
 * Displays a table of abuse/spam complaints for a specific campaign
 *
 * Server component with URL-based pagination for better performance
 * Refactored from TanStack Table to simple shadcn/ui Table (Issue #214)
 */

import React from "react";
import Link from "next/link";
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
import { Mail, Clock, ShieldAlert } from "lucide-react";
import type { AbuseReport } from "@/types/mailchimp";
import type { AbuseReportsTableProps } from "@/types/components/mailchimp/reports";
import { CampaignAbuseReportsEmpty } from "@/components/dashboard/reports/CampaignAbuseReportsEmpty";
import {
  getVipBadge,
  getActiveStatusBadge,
} from "@/components/ui/helpers/badge-utils";

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

  // URL generation functions for pagination
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

  // Defensive checks for data structure
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
                <TableRow>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Date Reported
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center">
                      List Status
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center">
                      VIP
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center">
                      Merge Fields
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {abuse_reports.length > 0 ? (
                  abuse_reports.map((report: AbuseReport) => {
                    const emailActivityUrl = `/mailchimp/reports/${campaignId}/email-activity/${report.email_id}`;

                    return (
                      <TableRow key={report.id}>
                        <TableCell className="px-2">
                          <div className="font-medium max-w-xs">
                            <Link
                              href={emailActivityUrl}
                              className="truncate hover:underline text-primary"
                              title={report.email_address}
                            >
                              {report.email_address}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="px-2">
                          <div className="text-muted-foreground">
                            {formatDateTime(report.date)}
                          </div>
                        </TableCell>
                        <TableCell className="px-2">
                          <Link
                            href={`/mailchimp/lists/${report.list_id}`}
                            className="inline-block hover:opacity-80 transition-opacity"
                          >
                            {getActiveStatusBadge(report.list_is_active)}
                          </Link>
                        </TableCell>
                        <TableCell className="px-2">
                          {getVipBadge(report.vip, "with-icon")}
                        </TableCell>
                        <TableCell className="px-2">
                          {formatMergeFields(report.merge_fields)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
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
