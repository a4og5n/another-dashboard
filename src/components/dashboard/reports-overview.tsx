/**
 * Reports Overview Dashboard Component
 * Displays campaign reports with metrics cards and report list
 *
 * Server component following PRD guideline: "Use [Server Components] by default"
 * Only pagination UI components are client-side for interactivity
 *
 * Issue #129: Reports dashboard component implementation
 * Following established patterns from ListOverview.tsx
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
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";
import {
  createPageUrlBuilder,
  createPerPageUrlBuilder,
  formatDateShort,
} from "@/utils";
import type { ReportsOverviewProps } from "@/types";
import { PER_PAGE_OPTIONS } from "@/types/components/ui";

export function ReportsOverview({
  data,
  currentPage = 1,
  pageSize = PER_PAGE_OPTIONS[0],
  error = null,
}: ReportsOverviewProps) {
  const defaultPageSize = PER_PAGE_OPTIONS[0];

  // URL builder functions for server-side navigation
  const createPageUrl = createPageUrlBuilder({
    basePath: "/mailchimp/reports",
    currentPage,
    currentPerPage: pageSize,
    defaultPerPage: defaultPageSize,
  });

  const createPerPageUrl = createPerPageUrlBuilder({
    basePath: "/mailchimp/reports",
    currentPage,
    currentPerPage: pageSize,
    defaultPerPage: defaultPageSize,
  });

  // Handle service-level errors passed from parent
  if (error) {
    return <DashboardInlineError error={error} />;
  }

  // Handle prop validation - no response data provided
  if (!data) {
    return <DashboardInlineError error="No report data provided" />;
  }

  // Extract reports and total count from API response
  const reports = data.reports || [];
  const totalCount = data.total_items || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

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
                          href={`/mailchimp/reports/${report.id}`}
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
                      <TableCell>
                        <Badge variant="default">Sent</Badge>
                      </TableCell>
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
                          <Link href={`/mailchimp/reports/${report.id}/report`}>
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
            value={pageSize}
            options={[...PER_PAGE_OPTIONS]}
            createPerPageUrl={createPerPageUrl}
            itemName="reports per page"
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
