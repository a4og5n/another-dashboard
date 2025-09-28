/**
 * Audience Overview Dashboard Component
 * Displays audience data in a table format with pagination controls
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
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/skeletons";
import { PaginationControls } from "@/components/dashboard/shared/pagination-controls";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { Users, Eye, Settings } from "lucide-react";
import Link from "next/link";
import { formatDateShort, useStaticPaginationHandlers } from "@/utils";
import { formatNumber } from "@/utils";
import { MailchimpAudienceQuerySchema } from "@/schemas/mailchimp/audience-query.schema";
import type { AudienceOverviewProps } from "@/types/components/mailchimp";

export function AudienceOverview({
  responseData,
  currentPage = 1,
  pageSize = MailchimpAudienceQuerySchema.parse({}).count,
  error = null,
  loading = false,
}: AudienceOverviewProps) {
  // Hooks must be called at the top, before any early returns
  const { handlePageChange, handlePerPageChange } =
    useStaticPaginationHandlers();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Audiences</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableSkeleton
            rows={pageSize}
            columns={7}
            data-testid="table-skeleton"
          />
        </CardContent>
      </Card>
    );
  }

  // Handle service-level errors passed from parent
  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-600 font-medium">Error loading audiences</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Handle prop validation - no response data provided
  if (!responseData) {
    return <DashboardInlineError error="No audience data provided" />;
  }

  const audiences = responseData.lists || [];
  const totalCount = responseData.total_items || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Audiences Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Audiences</span>
            {totalCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalCount.toLocaleString()}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {audiences.length === 0 ? (
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
              <span className="font-semibold text-lg mb-2">
                No audiences found
              </span>
              <span>
                Create your first audience to start building your email lists.
              </span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Audience Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-right">Open Rate</TableHead>
                    <TableHead className="text-right">Click Rate</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audiences.map((audience) => (
                    <TableRow key={audience.id}>
                      <TableCell className="font-medium max-w-xs">
                        <Link
                          href={`/mailchimp/audiences/${audience.id}`}
                          className="truncate hover:underline"
                          title={audience.name}
                        >
                          {audience.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {formatNumber(audience.stats.member_count)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            audience.visibility === "pub"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {audience.visibility === "pub" ? "Public" : "Private"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {audience.stats.open_rate
                          ? (audience.stats.open_rate * 100).toFixed(1) + "%"
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {audience.stats.click_rate
                          ? (audience.stats.click_rate * 100).toFixed(1) + "%"
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDateShort(audience.date_created)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/mailchimp/audiences/${audience.id}/settings`}
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Manage
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
      {audiences.length > 0 && totalPages > 1 && (
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
