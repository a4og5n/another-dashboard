"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { AudienceList } from "./AudienceList";
import type { AudienceModel, AudienceQueryFilters } from "@/dal/models/audience.model";

interface ClientAudienceListProps {
  audiences: AudienceModel[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  filters: Partial<AudienceQueryFilters>;
}

export function ClientAudienceList({
  audiences,
  totalCount,
  currentPage,
  pageSize,
  filters,
}: ClientAudienceListProps) {
  const router = useRouter();

  // Update URL parameters - follows mailchimp dashboard pattern
  const updateUrlParams = useCallback((
    newPage: number,
    newPageSize: number,
    newSortBy: string,
    newSortOrder: string,
    newSearch?: string,
    newVisibility?: string,
    newSyncStatus?: string
  ) => {
    const params = new URLSearchParams();
    
    params.set("page", newPage.toString());
    params.set("limit", newPageSize.toString());
    params.set("sort", newSortBy);
    params.set("order", newSortOrder);
    
    if (newSearch) params.set("search", newSearch);
    if (newVisibility) params.set("visibility", newVisibility);
    if (newSyncStatus) params.set("sync_status", newSyncStatus);

    router.push(`/mailchimp/audiences?${params.toString()}`, { scroll: false });
  }, [router]);

  const handleFiltersChange = useCallback((newFilters: Partial<AudienceQueryFilters>) => {
    updateUrlParams(
      1, // Reset to page 1 when filtering
      pageSize,
      newFilters.sort_by || filters.sort_by || "created_at",
      newFilters.sort_order || filters.sort_order || "desc",
      newFilters.name_contains || filters.name_contains || undefined,
      newFilters.visibility || filters.visibility || undefined,
      newFilters.sync_status || filters.sync_status || undefined
    );
  }, [updateUrlParams, pageSize, filters.sort_by, filters.sort_order, filters.name_contains, filters.visibility, filters.sync_status]);

  const handlePageChange = useCallback((page: number) => {
    updateUrlParams(
      page,
      pageSize,
      filters.sort_by || "created_at",
      filters.sort_order || "desc",
      filters.name_contains || undefined,
      filters.visibility || undefined,
      filters.sync_status || undefined
    );
  }, [updateUrlParams, pageSize, filters.sort_by, filters.sort_order, filters.name_contains, filters.visibility, filters.sync_status]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    updateUrlParams(
      1, // Reset to page 1 when changing page size
      newPageSize,
      filters.sort_by || "created_at",
      filters.sort_order || "desc",
      filters.name_contains || undefined,
      filters.visibility || undefined,
      filters.sync_status || undefined
    );
  }, [updateUrlParams, filters.sort_by, filters.sort_order, filters.name_contains, filters.visibility, filters.sync_status]);

  const handleCreateAudience = () => {
    // For now, just show a message - this will be implemented later
    alert("Create audience functionality will be implemented in a future update");
  };

  const handleEditAudience = (id: string) => {
    // For now, just show a message - this will be implemented later
    alert(`Edit audience ${id} functionality will be implemented in a future update`);
  };

  const handleArchiveAudience = (id: string) => {
    // For now, just show a message - this will be implemented later
    if (confirm("Are you sure you want to archive this audience?")) {
      alert(`Archive audience ${id} functionality will be implemented in a future update`);
    }
  };

  const handleViewDetails = useCallback((id: string) => {
    // For now, just show a message - this will be implemented later
    alert(`View details for audience ${id} functionality will be implemented in a future update`);
  }, []);

  // Memoize the filters object to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters,
    filters.sort_by,
    filters.sort_order, 
    filters.offset,
    filters.limit,
    filters.name_contains,
    filters.visibility,
    filters.sync_status
  ]);

  return (
    <AudienceList
      audiences={audiences}
      totalCount={totalCount}
      loading={false}
      error={null}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      filters={memoizedFilters}
      onFiltersChange={handleFiltersChange}
      onCreateAudience={handleCreateAudience}
      onEditAudience={handleEditAudience}
      onArchiveAudience={handleArchiveAudience}
      onViewStats={handleViewDetails}
    />
  );
}