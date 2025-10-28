/**
 * Landing Pages Content Component
 * Displays landing pages in a table format with status badges and metrics
 *
 * Uses shadcn/ui Table component for consistency
 * Server component with URL-based pagination
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { Badge } from "@/components/ui/badge";
import type { LandingPagesSuccess } from "@/types/mailchimp/landing-pages";
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { createPaginationUrls } from "@/utils/pagination/url-generators";
import { ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { formatDateTimeSafe } from "@/utils/format-date";
import { Button } from "@/components/ui/button";

interface LandingPagesContentProps {
  landingPagesData: LandingPagesSuccess;
  currentPage: number;
  pageSize: number;
  perPageOptions: number[];
  baseUrl: string;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  searchParams?: Record<string, string | string[] | undefined>;
}

/**
 * Get badge variant for landing page status
 */
function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "published":
      return "default"; // Active/live
    case "unpublished":
      return "secondary"; // Not live
    case "draft":
      return "outline"; // In progress
    default:
      return "outline";
  }
}

export function LandingPagesContent({
  landingPagesData,
  currentPage,
  pageSize,
  perPageOptions,
  baseUrl,
  sortField,
  sortDirection = "ASC",
  searchParams,
}: LandingPagesContentProps) {
  const { landing_pages, total_items } = landingPagesData;

  // Calculate pagination
  const totalPages = Math.ceil((total_items || 0) / pageSize);

  // URL generators for server-side pagination (preserves all query params)
  const { createPageUrl, createPerPageUrl } = createPaginationUrls(
    baseUrl,
    pageSize,
    searchParams,
  );

  // URL generator for sorting (preserves all query params, uses camelCase for UI consistency)
  const createSortUrl = (field?: string, direction?: "ASC" | "DESC") => {
    const params = new URLSearchParams();

    // Preserve existing search params
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const stringValue = Array.isArray(value) ? value[0] : value;
          if (stringValue) {
            params.set(key, stringValue);
          }
        }
      });
    }

    params.set("page", "1"); // Reset to first page when sorting changes
    if (field) {
      params.set("sortField", field); // Use camelCase in URL
      params.set("sortDir", direction || "ASC"); // Use camelCase in URL
    }

    // Clean up default values
    if (params.get("page") === "1") {
      params.delete("page");
    }
    if (params.get("perPage") === "10") {
      params.delete("perPage");
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Landing Pages ({(total_items || 0).toLocaleString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {landing_pages.length === 0 ? (
            <TableEmptyState message="No landing pages found." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>List</TableHead>
                  <TableHead>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 font-medium"
                    >
                      <Link
                        href={createSortUrl(
                          "createdAt",
                          sortField === "created_at" && sortDirection === "ASC"
                            ? "DESC"
                            : "ASC",
                        )}
                      >
                        Created
                        {sortField === "created_at" ? (
                          sortDirection === "ASC" ? (
                            <ArrowUp className="ml-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="ml-1 h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        )}
                      </Link>
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 font-medium"
                    >
                      <Link
                        href={createSortUrl(
                          "updatedAt",
                          sortField === "updated_at" && sortDirection === "ASC"
                            ? "DESC"
                            : "ASC",
                        )}
                      >
                        Updated
                        {sortField === "updated_at" ? (
                          sortDirection === "ASC" ? (
                            <ArrowUp className="ml-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="ml-1 h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        )}
                      </Link>
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {landing_pages.map((page) => (
                  <TableRow key={page.id}>
                    {/* Page Name - Clickable to detail page */}
                    <TableCell>
                      <div className="space-y-1">
                        <Link
                          href={`/mailchimp/landing-pages/${page.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {page.name}
                        </Link>
                        {page.title && (
                          <div className="text-sm text-muted-foreground">
                            {page.title}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <Badge variant={getStatusVariant(page.status)}>
                        {page.status}
                      </Badge>
                    </TableCell>

                    {/* Published URL */}
                    <TableCell>
                      {page.url ? (
                        <a
                          href={page.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                        >
                          View Page
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Not published
                        </span>
                      )}
                    </TableCell>

                    {/* Associated List */}
                    <TableCell>
                      {page.list_id ? (
                        <Link
                          href={`/mailchimp/lists/${page.list_id}`}
                          className="text-primary hover:underline text-sm"
                        >
                          View List
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Created At */}
                    <TableCell>
                      {page.created_at ? (
                        <span className="text-sm">
                          {formatDateTimeSafe(page.created_at)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Updated At */}
                    <TableCell>
                      {page.updated_at ? (
                        <span className="text-sm">
                          {formatDateTimeSafe(page.updated_at)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {total_items > 0 && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={pageSize}
            createPerPageUrl={createPerPageUrl}
            itemName="pages"
            options={perPageOptions}
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
