/**
 * List Overview Dashboard Component
 * Displays list data in a table format with pagination controls
 *
 * Server component following PRD guideline: "Use [Server Components] by default"
 * Only pagination UI components are client-side for interactivity
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
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { Star, Users } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import Link from "next/link";
import {
  createPageUrlBuilder,
  createPerPageUrlBuilder,
  formatDateShort,
  formatNumber,
  formatPercent,
} from "@/utils";
import type { ListOverviewProps } from "@/types/components/mailchimp";
import { listsParamsSchema } from "@/schemas/mailchimp/lists/params.schema";
import { PER_PAGE_OPTIONS } from "@/types/components/ui";
import { getVisibilityBadge } from "@/components/ui/helpers/badge-utils";

export function ListOverview({
  data,
  currentPage = 1,
  pageSize = listsParamsSchema.parse({}).count,
  error = null,
}: ListOverviewProps) {
  const defaultPageSize = listsParamsSchema.parse({}).count;

  // URL builder functions for server-side navigation
  const createPageUrl = createPageUrlBuilder({
    basePath: "/mailchimp/lists",
    currentPage,
    currentPerPage: pageSize,
    defaultPerPage: defaultPageSize,
  });

  const createPerPageUrl = createPerPageUrlBuilder({
    basePath: "/mailchimp/lists",
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
    return <DashboardInlineError error="No list data provided" />;
  }

  const lists = data.lists || [];
  const totalCount = data.total_items || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Lists Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Lists</span>
            {totalCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalCount.toLocaleString()}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lists.length === 0 ? (
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
              <span className="font-semibold text-lg mb-2">No lists found</span>
              <span>
                Create your first list to start building your email lists.
              </span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>List Name</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                    <TableHead className="text-right">Open Rate</TableHead>
                    <TableHead className="text-right">Click Rate</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lists.map((list) => (
                    <TableRow key={list.id}>
                      <TableCell className="font-medium max-w-xs">
                        <Link
                          href={`/mailchimp/lists/${list.id}`}
                          className="truncate hover:underline"
                          title={list.name}
                        >
                          {list.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <span>{formatNumber(list.stats.member_count)}</span>
                      </TableCell>
                      <TableCell>
                        {getVisibilityBadge(list.visibility, "with-icon")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${
                                index < list.list_rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercent(list.stats.open_rate)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercent(list.stats.click_rate)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDateShort(list.date_created)}
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
      {lists.length > 0 && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={pageSize}
            options={[...PER_PAGE_OPTIONS]}
            createPerPageUrl={createPerPageUrl}
            itemName="lists per page"
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
