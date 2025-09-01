"use client";

import { useCallback } from "react";
import { AudienceList } from "./AudienceList";
import type {
  AudienceModel,
  AudienceQueryFilters,
} from "@/dal/models/audience.model";

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
  const handleFiltersChange = useCallback(() => {
    // No-op: filters are now static
  }, []);

  const handlePageChange = useCallback(() => {
    // No-op: pagination is now static
  }, []);

  const handlePageSizeChange = useCallback(() => {
    // No-op: page size is now static
  }, []);

  const handleCreateAudience = () => {
    // For now, just show a message - this will be implemented later
    alert(
      "Create audience functionality will be implemented in a future update",
    );
  };

  const handleEditAudience = (id: string) => {
    // For now, just show a message - this will be implemented later
    alert(
      `Edit audience ${id} functionality will be implemented in a future update`,
    );
  };

  const handleArchiveAudience = (id: string) => {
    // For now, just show a message - this will be implemented later
    if (confirm("Are you sure you want to archive this audience?")) {
      alert(
        `Archive audience ${id} functionality will be implemented in a future update`,
      );
    }
  };

  const handleViewDetails = useCallback((id: string) => {
    // For now, just show a message - this will be implemented later
    alert(
      `View details for audience ${id} functionality will be implemented in a future update`,
    );
  }, []);

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
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onCreateAudience={handleCreateAudience}
      onEditAudience={handleEditAudience}
      onArchiveAudience={handleArchiveAudience}
      onViewStats={handleViewDetails}
    />
  );
}
