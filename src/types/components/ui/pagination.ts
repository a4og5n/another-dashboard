/**
 * PaginationProps type for Pagination component
 * Supports both callback-based and URL-based navigation
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Callback function for page changes (used in client components) */
  onPageChange?: (page: number) => void;
  /** URL generator function for page links (used in server components) */
  createPageUrl?: (page: number) => string;
}
