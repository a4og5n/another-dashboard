/**
 * Reports Overview Dashboard Coexport function ReportsOverview(rawProps: ReportsTableProps) {
  // Parse props with schema to apply validation and default values
  const {
    reports,
    loading,
    error,
    currentPage,
    totalPages,
    perPage,
    perPageOptions,
    onPageChange,
    onPerPageChange,
  } = reportsTablePropsSchema.parse(rawProps);

  if (loading) {plays campaign reports with metrics cards and report list
 *
 * Issue #129: Reports dashboard component implementation
 * Following established patterns from audiences-overview.tsx
 * Implements component reuse strategy with MetricCard and Table
 */

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
import { TableSkeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/dashboard/shared/pagination-controls";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { FileText, BarChart3 } from "lucide-react";
import Link from "next/link";
import type { ReportsTableProps } from "@/types";
import { reportsTablePropsSchema } from "@/schemas/components/dashboard/reports";
import { formatDateShort } from "@/utils";

/**
 * Gets status badge for sent campaigns
 */
function getStatusBadge() {
  return <Badge variant="default">Sent</Badge>;
}

export function ReportsOverview(rawProps: ReportsTableProps) {
  // Parse props with schema to apply validation and default values
  const {
    reports,
    loading,
    error,
    currentPage,
    totalPages,
    perPage,
    perPageOptions,
    onPageChange,
    onPerPageChange,
  } = reportsTablePropsSchema.parse({
    // Ensure all required fields are present with proper defaults
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    perPageOptions: [10, 20, 50],
    ...rawProps, // Override with provided props
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Campaign Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableSkeleton
            rows={perPage}
            columns={9}
            data-testid="table-skeleton"
          />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-600 font-medium">Error loading reports</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Campaign Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-8 text-muted-foreground"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <FileText
                className="h-8 w-8 mb-2 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="font-semibold text-lg mb-2">
                No campaign reports found
              </span>
              <span>
                Send campaigns to view them here with performance metrics.
              </span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>List Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Emails Sent</TableHead>
                    <TableHead className="text-right">Abuse Reports</TableHead>
                    <TableHead className="text-right">Unsubscribed</TableHead>
                    <TableHead className="text-right">Sent Date</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium max-w-xs">
                        <Link
                          href={`/mailchimp/campaigns/${report.id}`}
                          className="truncate hover:underline"
                          title={report.campaign_title}
                        >
                          {report.campaign_title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {report.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <Link
                          href={`/mailchimp/audiences/${report.list_id}`}
                          className="truncate hover:underline"
                          title={report.list_name}
                        >
                          {report.list_name}
                        </Link>
                      </TableCell>
                      <TableCell>{getStatusBadge()}</TableCell>
                      <TableCell className="text-right">
                        {report.emails_sent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {report.abuse_reports.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {report.unsubscribed.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDateShort(report.send_time)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/mailchimp/campaigns/${report.id}/report`}
                          >
                            <BarChart3 className="h-3 w-3 mr-1" />
                            View Report
                          </Link>
                        </Button>
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
      {reports.length > 0 && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={perPage}
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
