import { useState } from "react";

export function usePagination({
  initialPage = 1,
  totalPages = 1,
}: {
  initialPage?: number;
  totalPages: number;
}) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    setCurrentPage: goToPage,
    totalPages,
  };
}
