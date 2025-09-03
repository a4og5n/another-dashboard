/**
 * Reports Overview Dashboard Component
 * Displays campaign reports with metrics cards and report list
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
import { TableSkeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/dashboard/shared/pagination-controls";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { FileText } from "lucide-react";
import Link from "next/link";
import type { ReportsOverviewProps } from "@/types/mailchimp/reports";

interface ReportsTableProps {
  reports: ReportsOverviewProps["reports"];
  loading?: boolean;
  error?: string | null;
  currentPage?: number;
  totalPages?: number;
  perPage?: number;
  perPageOptions?: number[];
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

/**
 * Formats date string for display
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Gets status badge for sent campaigns
 */
function getStatusBadge() {
  return <Badge variant="default">Sent</Badge>;
}

export function ReportsOverview({
  reports,
  loading = false,
  error = null,
  currentPage = 1,
  totalPages = 1,
  perPage = 10,
  perPageOptions = [10, 20, 50],
  onPageChange,
  onPerPageChange,
}: ReportsTableProps) {
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
            columns={8}
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
      {/* Campaign Reports Table */}
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
              <span>Send some campaigns to see performance reports here.</span>
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
                        {formatDate(report.send_time)}
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
