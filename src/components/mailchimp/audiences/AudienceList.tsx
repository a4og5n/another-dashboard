import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AudienceCard } from "./AudienceCard";
import { PaginationControls } from "@/components/dashboard/shared/pagination-controls";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { TableSkeleton } from "@/components/ui/skeleton";
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Grid3X3,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AudienceQueryFilters } from "@/dal/models/audience.model";
import type { AudienceListProps } from "@/types/mailchimp/audience";


type ViewMode = "grid" | "list";

export function AudienceList({
  audiences,
  totalCount,
  loading = false,
  error = null,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  filters,
  onFiltersChange,
  onCreateAudience,
  onEditAudience,
  onArchiveAudience,
  onViewStats,
  className,
}: AudienceListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState(filters.name_contains || "");

  // Update local search query when filters change from external sources (URL params)
  React.useEffect(() => {
    if (filters.name_contains !== searchQuery) {
      setSearchQuery(filters.name_contains || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.name_contains]); // Only sync when the external filter changes

  // Debounced search - only trigger when searchQuery changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.name_contains) {
        onFiltersChange({
          ...filters,
          name_contains: searchQuery || undefined,
          offset: 0, // Reset to first page when searching
        });
        onPageChange(1);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]); // Only depend on searchQuery to prevent loops

  const handleVisibilityFilter = (visibility: string) => {
    const newVisibility =
      visibility === "all" ? undefined : (visibility as "pub" | "prv");
    onFiltersChange({
      ...filters,
      visibility: newVisibility,
      offset: 0,
    });
    onPageChange(1);
  };

  const handleSyncStatusFilter = (status: string) => {
    const newStatus =
      status === "all"
        ? undefined
        : (status as AudienceQueryFilters["sync_status"]);
    onFiltersChange({
      ...filters,
      sync_status: newStatus,
      offset: 0,
    });
    onPageChange(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    onFiltersChange({
      sort_by: "created_at",
      sort_order: "desc",
      offset: 0,
      limit: pageSize,
    });
    onPageChange(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasActiveFilters = !!(
    filters.name_contains ||
    filters.visibility ||
    filters.sync_status
  );

  return (
    <Card className={cn("w-full", className)}>
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
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className="h-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className="h-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            {onCreateAudience && (
              <Button onClick={onCreateAudience} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Audience
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Filters and Search */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search audiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search audiences"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select
                value={filters.visibility || "all"}
                onValueChange={handleVisibilityFilter}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pub">Public</SelectItem>
                  <SelectItem value="prv">Private</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sync_status || "all"}
                onValueChange={handleSyncStatusFilter}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Synced</SelectItem>
                  <SelectItem value="syncing">Syncing</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={`${filters.sort_by || "created_at"}_${filters.sort_order || "desc"}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split("_");
                  onFiltersChange({
                    ...filters,
                    sort_by: sortBy as AudienceQueryFilters["sort_by"],
                    sort_order: sortOrder as "asc" | "desc",
                    offset: 0,
                  });
                  onPageChange(1);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at_desc">Newest First</SelectItem>
                  <SelectItem value="created_at_asc">Oldest First</SelectItem>
                  <SelectItem value="name_asc">Name A-Z</SelectItem>
                  <SelectItem value="name_desc">Name Z-A</SelectItem>
                  <SelectItem value="member_count_desc">
                    Most Members
                  </SelectItem>
                  <SelectItem value="member_count_asc">
                    Fewest Members
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Active filters applied
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            <TableSkeleton
              rows={6}
              columns={1}
              data-testid="audiences-skeleton"
            />
          </div>
        ) : error ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center"
            role="alert"
            aria-live="polite"
          >
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Error Loading Audiences
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              aria-label="Retry loading audiences"
            >
              Try Again
            </Button>
          </div>
        ) : audiences.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center"
            role="status"
            aria-live="polite"
          >
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {hasActiveFilters
                ? "No matching audiences"
                : "No audiences found"}
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              {hasActiveFilters
                ? "Try adjusting your filters to find more audiences."
                : "Create your first audience to start building your email lists."}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            ) : onCreateAudience ? (
              <Button onClick={onCreateAudience}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Audience
              </Button>
            ) : null}
          </div>
        ) : (
          <>
            {/* Grid/List View */}
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4",
              )}
            >
              {audiences.map((audience) => (
                <AudienceCard
                  key={audience.id}
                  audience={audience}
                  onEdit={onEditAudience}
                  onArchive={onArchiveAudience}
                  onViewStats={onViewStats}
                  className={cn(viewMode === "list" && "max-w-none")}
                />
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
                    {totalCount.toLocaleString()} audiences
                  </div>
                </div>

                <PaginationControls
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

AudienceList.displayName = "AudienceList";
