"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AudienceCard } from "@/components/mailchimp/audiences/AudienceCard";
import { PaginationControls } from "@/components/dashboard/shared/pagination-controls";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { Users, TrendingUp, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStaticPaginationHandlers } from "@/utils/pagination";
import { calculateAudienceStats } from "@/utils/mailchimp";
import { formatNumber } from "@/utils";
import type { AudienceOverviewProps } from "@/types/components/mailchimp";

export function AudienceOverview({
  responseData,
  currentPage,
  pageSize,
  error = null,
  className,
}: AudienceOverviewProps) {
  // Hooks must be called at the top, before any early returns
  const { handlePageChange, handlePerPageChange } =
    useStaticPaginationHandlers();

  // Handle service-level errors passed from parent
  if (error) {
    return <DashboardInlineError error={error} />;
  }

  // Handle prop validation - no response data provided
  if (!responseData) {
    return <DashboardInlineError error="No audience data provided" />;
  }

  // Calculate audience statistics and extract data using utility function
  const { stats, audiences, totalCount } = calculateAudienceStats(responseData);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Audience Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Audiences
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.total_audiences)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Active email lists
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.total_members)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Across all audiences
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visibility</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className="text-blue-600">
                {stats.audiences_by_visibility.pub}
              </span>
              <span className="text-muted-foreground mx-1">/</span>
              <span className="text-gray-600">
                {stats.audiences_by_visibility.prv}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Public / Private
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Audience List */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Audiences</span>
              {totalCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {totalCount.toLocaleString()}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Content */}
          {audiences.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center"
              role="status"
              aria-live="polite"
            >
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No audiences found</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Create your first audience to start building your email lists.
              </p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {audiences.map((audience) => (
                  <AudienceCard
                    key={audience.id}
                    audience={audience}
                    className=""
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
                  <div className="flex items-center gap-4">
                    <PerPageSelector
                      value={pageSize}
                      onChange={handlePerPageChange}
                      options={[12, 24, 48, 96]}
                    />
                    <div className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, totalCount)} of{" "}
                      {totalCount.toLocaleString()} audiences
                    </div>
                  </div>

                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
