import React from "react";
import { Button } from "./button";
import { PaginationProps } from "@/types/components/ui/pagination";

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={currentPage === 1}
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
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};
