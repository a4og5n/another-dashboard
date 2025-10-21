/**
 * Campaign Click Details Content Component
 * Displays URLs clicked in a campaign with pagination
 *
 * @route /mailchimp/reports/[id]/clicks
 */

"use client";

import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { formatDateTime } from "@/utils/format-date";
import { Link, MousePointerClick } from "lucide-react";
import type { z } from "zod";
import type { reportClickListSuccessSchema } from "@/schemas/mailchimp/report-click-details-success.schema";

type ClickListSuccess = z.infer<typeof reportClickListSuccessSchema>;

interface ClickDetailsContentProps {
  clicksData: ClickListSuccess | null;
  campaignId: string;
  currentPage: number;
  pageSize: number;
  errorCode?: string;
}

export function ClickDetailsContent({
  clicksData,
  campaignId,
  currentPage,
  pageSize,
  errorCode,
}: ClickDetailsContentProps) {
  const { urls_clicked, total_items } = clicksData || {};

  // Calculate pagination
  const totalPages = Math.ceil((total_items || 0) / pageSize);
  const baseUrl = `/mailchimp/reports/${campaignId}/clicks`;

  // Use shared pagination hook for URL generation
  const { createPageUrl, createPerPageUrl } = useTablePagination({
    baseUrl,
    pageSize,
  });

  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      {!clicksData ? (
        <DashboardInlineError error="Failed to load click details" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointerClick className="h-5 w-5" />
              Click Details
              <span className="text-sm font-normal text-muted-foreground">
                ({total_items?.toLocaleString() || 0} URLs)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* URLs List */}
              {urls_clicked && urls_clicked.length > 0 ? (
                <div className="space-y-2">
                  {urls_clicked.map((urlData) => (
                    <div
                      key={urlData.id}
                      className="flex flex-col gap-2 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Link className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <a
                              href={urlData.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-blue-600 hover:underline truncate"
                              title={urlData.url}
                            >
                              {urlData.url}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Clicks</p>
                          <p className="font-semibold">
                            {urlData.total_clicks.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Unique Clicks</p>
                          <p className="font-semibold">
                            {urlData.unique_clicks.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Click %</p>
                          <p className="font-semibold">
                            {urlData.click_percentage.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Click</p>
                          <p className="font-semibold text-xs">
                            {formatDateTime(urlData.last_click)}
                          </p>
                        </div>
                      </div>

                      {urlData.ab_split && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-2">
                            A/B Split Data
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="font-medium">Variant A</p>
                              <p>
                                Clicks: {urlData.ab_split.a.total_clicks_a} (
                                {urlData.ab_split.a.click_percentage_a.toFixed(
                                  1,
                                )}
                                %)
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Variant B</p>
                              <p>
                                Clicks: {urlData.ab_split.b.total_clicks_b} (
                                {urlData.ab_split.b.click_percentage_b.toFixed(
                                  1,
                                )}
                                %)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MousePointerClick className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No click data available for this campaign</p>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                  <PerPageSelector
                    value={pageSize}
                    options={[...PER_PAGE_OPTIONS]}
                    createPerPageUrl={createPerPageUrl}
                  />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    createPageUrl={createPageUrl}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </MailchimpConnectionGuard>
  );
}
