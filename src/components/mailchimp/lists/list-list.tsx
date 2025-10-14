import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListCard } from "./list-card";
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { TableSkeleton } from "@/skeletons";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { List } from "@/types/mailchimp";

interface ListListProps {
  lists: List[];
  totalCount: number;
  loading?: boolean;
  error?: string | null;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
}

export function ListList({
  lists,
  totalCount,
  loading = false,
  error = null,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
}: Pick<
  ListListProps,
  | "lists"
  | "totalCount"
  | "loading"
  | "error"
  | "currentPage"
  | "pageSize"
  | "onPageChange"
  | "onPageSizeChange"
  | "className"
>) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Lists</span>
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
        {loading ? (
          <div className="space-y-4">
            <TableSkeleton rows={6} columns={1} data-testid="lists-skeleton" />
          </div>
        ) : error ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center"
            role="alert"
            aria-live="polite"
          >
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Error Loading Lists</h3>
            <p className="text-muted-foreground mb-4 max-w-md">{error}</p>
          </div>
        ) : lists.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center"
            role="status"
            aria-live="polite"
          >
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No lists found</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Create your first list to start building your email lists.
            </p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((list) => (
                <ListCard key={list.id} list={list} className="" />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
                <div className="flex items-center gap-4">
                  <PerPageSelector
                    value={pageSize}
                    onChange={onPageSizeChange}
                    options={[12, 24, 48, 96]}
                  />
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, totalCount)} of{" "}
                    {totalCount.toLocaleString()} lists
                  </div>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

ListList.displayName = "ListList";
