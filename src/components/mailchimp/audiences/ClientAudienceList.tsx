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
}: Pick<
  ClientAudienceListProps,
  "audiences" | "totalCount" | "currentPage" | "pageSize"
>) {
  const handlePageChange = useCallback(() => {
    // No-op: pagination is now static
  }, []);

  const handlePageSizeChange = useCallback(() => {
    // No-op: page size is now static
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
    />
  );
}
