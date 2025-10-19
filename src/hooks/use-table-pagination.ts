/**
 * Custom hook for table pagination URL management
 *
 * Provides URL generation utilities for table pagination and per-page controls.
 * Handles query parameter construction following the pattern:
 * - page: Only included if > 1
 * - perPage: Only included if not default (10)
 *
 * @example
 * ```tsx
 * const { createPageUrl, createPerPageUrl } = useTablePagination({
 *   baseUrl: '/mailchimp/reports/123/opens',
 *   pageSize: 25,
 * });
 *
 * // Generate URL for page 2 with custom page size
 * const url = createPageUrl(2); // "/mailchimp/reports/123/opens?page=2&perPage=25"
 * ```
 */

import { useCallback } from "react";
import type {
  UseTablePaginationProps,
  UseTablePaginationReturn,
} from "@/types/hooks/use-table-pagination";

/**
 * Hook for managing table pagination URLs
 */
export function useTablePagination({
  baseUrl,
  pageSize,
  defaultPageSize = 10,
}: UseTablePaginationProps): UseTablePaginationReturn {
  /**
   * Create URL for navigating to a specific page
   */
  const createPageUrl = useCallback(
    (page: number) => {
      const params = new URLSearchParams();

      // Only add page if not page 1
      if (page > 1) {
        params.set("page", page.toString());
      }

      // Add perPage if it's not the default
      if (pageSize !== defaultPageSize) {
        params.set("perPage", pageSize.toString());
      }

      return `${baseUrl}${params.toString() ? `?${params.toString()}` : ""}`;
    },
    [baseUrl, pageSize, defaultPageSize],
  );

  /**
   * Create URL for changing page size
   * Resets to page 1 when page size changes
   */
  const createPerPageUrl = useCallback(
    (newPerPage: number) => {
      const params = new URLSearchParams();

      // Reset to page 1 when changing page size
      // Only add perPage if it's not the default
      if (newPerPage !== defaultPageSize) {
        params.set("perPage", newPerPage.toString());
      }

      return `${baseUrl}${params.toString() ? `?${params.toString()}` : ""}`;
    },
    [baseUrl, defaultPageSize],
  );

  return {
    createPageUrl,
    createPerPageUrl,
  };
}
