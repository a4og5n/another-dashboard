import { Pagination } from "@/components/ui/pagination";
import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  /** Function that generates URL for a given page number (for URL-based navigation) */
  createPageUrl?: (page: number) => string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  createPageUrl,
}: PaginationControlsProps) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      createPageUrl={createPageUrl}
    />
  );
}
