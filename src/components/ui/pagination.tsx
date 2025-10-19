import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaginationProps } from "@/types/components/ui/pagination";

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  createPageUrl,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  // URL-based navigation (for server components)
  if (createPageUrl) {
    return (
      <div className="flex items-center gap-2 mt-4">
        {currentPage > 1 && (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
          >
            Previous
          </Link>
        )}
        <span className="px-2 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        {currentPage < totalPages && (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
          >
            Next
          </Link>
        )}
      </div>
    );
  }

  // Callback-based navigation (for client components)
  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={currentPage === 1 || totalPages <= 1}
      >
        Previous
      </Button>
      <span className="px-2 text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages || totalPages <= 1}
      >
        Next
      </Button>
    </div>
  );
};
