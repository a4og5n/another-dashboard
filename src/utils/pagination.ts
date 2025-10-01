/**
 * Client-side pagination utilities using React hooks
 *
 * These utilities provide standardized pagination handlers that can be reused
 * across different client components and pages to maintain consistency.
 *
 * Note: For server components, use the utilities from @/utils/pagination-url-builders
 */

"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { PaginationParams } from "@/utils/pagination-url-builders";
import { buildURLParams } from "@/utils/pagination-url-builders";

// Re-export for backward compatibility
export type { PaginationParams };

export interface PaginationConfig {
  /** Base URL path for navigation */
  basePath: string;
  /** Current pagination state */
  currentParams: PaginationParams;
}

/**
 * Creates standardized pagination handlers for page and perPage changes
 *
 * @param config - Pagination configuration
 * @returns Object containing handlePageChange and handlePerPageChange functions
 *
 * @example
 * ```tsx
 * const { handlePageChange, handlePerPageChange } = usePaginationHandlers({
 *   basePath: "/mailchimp/campaigns",
 *   currentParams: {
 *     page: currentPage,
 *     perPage: perPage,
 *     additionalParams: { type: reportType, before_send_time: beforeSendTime }
 *   }
 * });
 * ```
 */
export function usePaginationHandlers(config: PaginationConfig) {
  const router = useRouter();
  const { basePath, currentParams } = config;

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = buildURLParams({
        ...currentParams,
        page: newPage,
      });
      router.push(`${basePath}?${params.toString()}`);
    },
    [router, basePath, currentParams],
  );

  const handlePerPageChange = useCallback(
    (newPerPage: number) => {
      const params = buildURLParams({
        ...currentParams,
        page: 1, // Reset to first page when changing page size
        perPage: newPerPage,
      });
      router.push(`${basePath}?${params.toString()}`);
    },
    [router, basePath, currentParams],
  );

  return {
    handlePageChange,
    handlePerPageChange,
  };
}

// Re-export buildURLParams for backward compatibility
export { buildURLParams };

/**
 * Creates no-op pagination handlers for static/non-interactive pagination
 * Useful when pagination is present for display but not interactive
 *
 * @returns Object containing no-op handlePageChange and handlePerPageChange functions
 */
export function useStaticPaginationHandlers() {
  const handlePageChange = useCallback(() => {
    // No-op: pagination is static
  }, []);

  const handlePerPageChange = useCallback(() => {
    // No-op: page size is static
  }, []);

  return {
    handlePageChange,
    handlePerPageChange,
  };
}

// Note: Server-side URL builders have been moved to @/utils/pagination-url-builders
// This file is client-side only due to useRouter usage

/**
 * Type definitions for pagination handlers
 */
export type PaginationHandlers = ReturnType<typeof usePaginationHandlers>;
export type StaticPaginationHandlers = ReturnType<
  typeof useStaticPaginationHandlers
>;
