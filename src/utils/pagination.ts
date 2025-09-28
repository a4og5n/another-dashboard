/**
 * Reusable pagination utilities for consistent URL parameter handling
 *
 * These utilities provide standardized pagination handlers that can be reused
 * across different components and pages to maintain consistency.
 */

"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export interface PaginationParams {
  /** Current page number */
  page?: number;
  /** Items per page */
  perPage?: number;
  /** Additional query parameters to preserve */
  additionalParams?: Record<string, string | undefined>;
}

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

/**
 * Builds URLSearchParams from pagination parameters
 *
 * @param params - Pagination parameters
 * @returns URLSearchParams object ready for navigation
 */
export function buildURLParams(params: PaginationParams): URLSearchParams {
  const urlParams = new URLSearchParams();

  // Add core pagination params
  if (params.page && params.page > 1) {
    urlParams.set("page", params.page.toString());
  }

  if (params.perPage) {
    urlParams.set("perPage", params.perPage.toString());
  }

  // Add additional params, filtering out undefined values
  if (params.additionalParams) {
    Object.entries(params.additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        urlParams.set(key, value);
      }
    });
  }

  return urlParams;
}

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

// Note: transformPaginationParams has been moved to @/utils/mailchimp/query-params
// to be server-compatible (this file is client-side only due to useRouter usage)

/**
 * Type definitions for pagination handlers
 */
export type PaginationHandlers = ReturnType<typeof usePaginationHandlers>;
export type StaticPaginationHandlers = ReturnType<
  typeof useStaticPaginationHandlers
>;
