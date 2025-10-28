/**
 * Pagination URL Generators
 * Utilities for creating URL-based pagination links in Server Components
 *
 * These utilities support the Server Component pagination pattern where
 * pagination state is stored in URL query parameters instead of client state.
 * This approach is:
 * - SEO-friendly (crawlable pagination)
 * - Shareable (links contain pagination state)
 * - Server Component compatible (no client-side state needed)
 */

/**
 * Creates URL generator functions for paginated Server Components
 *
 * @param baseUrl - The base path for the page (e.g., "/mailchimp/reports/123/emails")
 * @param currentPageSize - Current items per page setting
 * @param currentSearchParams - Optional current URL search params to preserve other parameters
 * @returns Object with createPageUrl and createPerPageUrl functions
 *
 * @example
 * ```tsx
 * // In a Server Component
 * export function MyTable({ data, currentPage, pageSize, baseUrl, searchParams }: Props) {
 *   const { createPageUrl, createPerPageUrl } = createPaginationUrls(
 *     baseUrl,
 *     pageSize,
 *     searchParams
 *   );
 *
 *   return (
 *     <>
 *       <Table>...</Table>
 *       <Pagination
 *         currentPage={currentPage}
 *         totalPages={totalPages}
 *         createPageUrl={createPageUrl}
 *       />
 *       <PerPageSelector
 *         value={pageSize}
 *         createPerPageUrl={createPerPageUrl}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function createPaginationUrls(
  baseUrl: string,
  currentPageSize: number,
  currentSearchParams?: Record<string, string | string[] | undefined>,
) {
  /**
   * Helper to get clean query params preserving existing parameters
   */
  const getBaseParams = (): URLSearchParams => {
    const params = new URLSearchParams();
    if (currentSearchParams) {
      Object.entries(currentSearchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Convert array to string (take first value)
          const stringValue = Array.isArray(value) ? value[0] : value;
          if (stringValue) {
            params.set(key, stringValue);
          }
        }
      });
    }
    return params;
  };

  /**
   * Helper to remove default parameters that match default values
   */
  const cleanDefaultParams = (params: URLSearchParams): void => {
    // Remove page=1 if it's the default
    if (params.get("page") === "1") {
      params.delete("page");
    }
    // Remove perPage if it matches default (10)
    if (params.get("perPage") === "10") {
      params.delete("perPage");
    }
  };

  /**
   * Creates URL for a specific page number
   * Preserves all other query parameters (sort, filters, etc.)
   */
  const createPageUrl = (page: number): string => {
    const params = getBaseParams();
    params.set("page", page.toString());
    params.set("perPage", currentPageSize.toString());
    cleanDefaultParams(params);
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  /**
   * Creates URL for changing items per page
   * Resets to page 1 but preserves all other query parameters (sort, filters, etc.)
   */
  const createPerPageUrl = (newPerPage: number): string => {
    const params = getBaseParams();
    params.set("page", "1"); // Reset to page 1 when changing perPage
    params.set("perPage", newPerPage.toString());
    cleanDefaultParams(params);
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  return {
    createPageUrl,
    createPerPageUrl,
  };
}

/**
 * Type definition for pagination URL generator return value
 * Useful for components that accept URL generators as props
 */
export type PaginationUrlGenerators = ReturnType<typeof createPaginationUrls>;
