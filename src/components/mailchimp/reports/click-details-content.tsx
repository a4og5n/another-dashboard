/**
 * Campaign Click Details Content Component
 * Displays URLs clicked in a campaign with pagination
 *
 * Server component with URL-based pagination for better performance
 * Refactored from TanStack Table to simple shadcn/ui Table (Issue #214)
 *
 * @route /mailchimp/reports/[id]/clicks
 */

import React from "react";
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
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import { formatDateTime } from "@/utils/format-date";
import { MousePointerClick } from "lucide-react";
import { createPaginationUrls } from "@/utils/pagination/url-generators";
import type { z } from "zod";
import type {
  reportClickListSuccessSchema,
  urlClickedSchema,
} from "@/schemas/mailchimp/reports/click-details/success.schema";

type ClickListSuccess = z.infer<typeof reportClickListSuccessSchema>;
type UrlClicked = z.infer<typeof urlClickedSchema>;

interface ClickDetailsContentProps {
  clicksData: ClickListSuccess | null;
  campaignId: string;
  currentPage: number;
  pageSize: number;
}

export function ClickDetailsContent({
  clicksData,
  campaignId,
  currentPage,
  pageSize,
}: ClickDetailsContentProps) {
  const { urls_clicked, total_items } = clicksData || {};

  // Calculate pagination
  const totalPages = Math.ceil((total_items || 0) / pageSize);
  const baseUrl = `/mailchimp/reports/${campaignId}/clicks`;

  // URL generators for server-side pagination
  const { createPageUrl, createPerPageUrl } = createPaginationUrls(
    baseUrl,
    pageSize,
  );

  if (!clicksData) {
    return <DashboardInlineError error="Failed to load click details" />;
  }

  return (
    <>
      {/* Click Details Table */}
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center">
                      URL
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center justify-end text-right">
                      Total Clicks
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center justify-end text-right">
                      Unique Clicks
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center justify-end text-right">
                      Click %
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center justify-end text-right">
                      Unique %
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center">
                      Last Click
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls_clicked && urls_clicked.length > 0 ? (
                  urls_clicked.map((urlClick: UrlClicked, index: number) => (
                    <TableRow key={urlClick.id || index}>
                      <TableCell className="px-2">
                        <div className="max-w-md">
                          <div
                            className="text-sm truncate"
                            title={urlClick.url}
                          >
                            {urlClick.url}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-2">
                        <div className="text-right">
                          <span className="font-mono">
                            {urlClick.total_clicks.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-2">
                        <div className="text-right">
                          <span className="font-mono">
                            {urlClick.unique_clicks.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-2">
                        <div className="text-right">
                          <span className="font-mono">
                            {urlClick.click_percentage.toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-2">
                        <div className="text-right">
                          <span className="font-mono">
                            {urlClick.unique_click_percentage.toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-2">
                        <div className="text-muted-foreground text-sm">
                          {urlClick.last_click
                            ? formatDateTime(urlClick.last_click)
                            : "N/A"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <MousePointerClick className="h-12 w-12 mb-3 opacity-50" />
                        <p>No click data available for this campaign</p>
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
      {total_items && total_items > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <PerPageSelector
            value={pageSize}
            options={[...PER_PAGE_OPTIONS]}
            createPerPageUrl={createPerPageUrl}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              createPageUrl={createPageUrl}
            />
          )}
        </div>
      )}
    </>
  );
}
