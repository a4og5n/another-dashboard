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
 * @returns Object with createPageUrl and createPerPageUrl functions
 *
 * @example
 * ```tsx
 * // In a Server Component
 * export function MyTable({ data, currentPage, pageSize, baseUrl }: Props) {
 *   const { createPageUrl, createPerPageUrl } = createPaginationUrls(baseUrl, pageSize);
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
export function createPaginationUrls(baseUrl: string, currentPageSize: number) {
  /**
   * Creates URL for a specific page number
   * Preserves current perPage setting
   */
  const createPageUrl = (page: number): string => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("perPage", currentPageSize.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  /**
   * Creates URL for changing items per page
   * Always resets to page 1 when changing page size
   */
  const createPerPageUrl = (newPerPage: number): string => {
    const params = new URLSearchParams();
    params.set("page", "1"); // Reset to page 1 when changing perPage
    params.set("perPage", newPerPage.toString());
    return `${baseUrl}?${params.toString()}`;
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
