/**
 * Types for useTablePagination hook
 */

export interface UseTablePaginationProps {
  /**
   * Base URL for the table page (without query parameters)
   * @example "/mailchimp/reports/abc123/opens"
   */
  baseUrl: string;

  /**
   * Current page size (number of items per page)
   * @default 10
   */
  pageSize: number;

  /**
   * Default page size to compare against
   * @default 10
   */
  defaultPageSize?: number;
}

export interface UseTablePaginationReturn {
  /**
   * Create a URL for a specific page number
   * @param page - Page number (1-indexed)
   * @returns URL string with appropriate query parameters
   */
  createPageUrl: (page: number) => string;

  /**
   * Create a URL for changing the page size
   * Resets to page 1 when page size changes
   * @param newPerPage - New page size
   * @returns URL string with appropriate query parameters
   */
  createPerPageUrl: (newPerPage: number) => string;
}
