/**
 * Server-side pagination URL builders
 *
 * These utilities are server-compatible and don't use React hooks.
 * They can be used in both server and client components.
 */

export interface PaginationParams {
  /** Current page number */
  page?: number;
  /** Items per page */
  perPage?: number;
  /** Default items per page (used to omit perPage from URL when it matches default) */
  defaultPerPage?: number;
  /** Additional query parameters to preserve */
  additionalParams?: Record<string, string | undefined>;
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

  // Only add perPage if it differs from the default
  if (params.perPage && params.perPage !== params.defaultPerPage) {
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
 * Server-side URL builder configuration
 */
export interface CreateUrlConfig {
  /** Base path for the URL */
  basePath: string;
  /** Current page number */
  currentPage: number;
  /** Current items per page */
  currentPerPage: number;
  /** Default items per page (to omit from URL when matching) */
  defaultPerPage: number;
  /** Additional query parameters to preserve */
  additionalParams?: Record<string, string | undefined>;
}

/**
 * Creates a URL builder function for page navigation (server-side compatible)
 *
 * @param config - URL builder configuration
 * @returns Function that takes a page number and returns a URL string
 *
 * @example
 * ```tsx
 * const createPageUrl = createPageUrlBuilder({
 *   basePath: "/mailchimp/lists",
 *   currentPage: 2,
 *   currentPerPage: 25,
 *   defaultPerPage: 10
 * });
 *
 * createPageUrl(3); // "/mailchimp/lists?page=3&perPage=25"
 * createPageUrl(1); // "/mailchimp/lists?perPage=25" (page=1 omitted)
 * ```
 */
export function createPageUrlBuilder(config: CreateUrlConfig) {
  return (page: number): string => {
    const params = buildURLParams({
      page,
      perPage: config.currentPerPage,
      defaultPerPage: config.defaultPerPage,
      additionalParams: config.additionalParams,
    });
    return `${config.basePath}${params.toString() ? `?${params}` : ""}`;
  };
}

/**
 * Creates a URL builder function for per-page size changes (server-side compatible)
 *
 * @param config - URL builder configuration
 * @returns Function that takes a per-page size and returns a URL string
 *
 * @example
 * ```tsx
 * const createPerPageUrl = createPerPageUrlBuilder({
 *   basePath: "/mailchimp/lists",
 *   currentPage: 2,
 *   currentPerPage: 10,
 *   defaultPerPage: 10
 * });
 *
 * createPerPageUrl(25); // "/mailchimp/lists?perPage=25" (resets to page 1)
 * createPerPageUrl(10); // "/mailchimp/lists" (default perPage omitted)
 * ```
 */
export function createPerPageUrlBuilder(config: CreateUrlConfig) {
  return (newPerPage: number): string => {
    const params = buildURLParams({
      page: 1, // Always reset to page 1 when changing page size
      perPage: newPerPage,
      defaultPerPage: config.defaultPerPage,
      additionalParams: config.additionalParams,
    });
    return `${config.basePath}${params.toString() ? `?${params}` : ""}`;
  };
}

/**
 * URL cleanup configuration for server-side redirects
 */
export interface UrlCleanupConfig {
  /** Base path for the URL */
  basePath: string;
  /** Current page from URL params (as string) */
  currentPage?: string;
  /** Current perPage from URL params (as string) */
  currentPerPage?: string;
  /** Default page number (typically 1) */
  defaultPage?: number;
  /** Default items per page */
  defaultPerPage: number;
  /** Additional query parameters to preserve */
  additionalParams?: Record<string, string | undefined>;
}

/**
 * Checks if URL contains default values that should be removed
 *
 * @param config - URL cleanup configuration
 * @returns true if redirect is needed to clean URL
 *
 * @example
 * ```tsx
 * shouldRedirectToCleanUrl({
 *   basePath: "/mailchimp/lists",
 *   currentPage: "1",
 *   currentPerPage: "10",
 *   defaultPage: 1,
 *   defaultPerPage: 10
 * }); // true - both params match defaults
 * ```
 */
export function shouldRedirectToCleanUrl(config: UrlCleanupConfig): boolean {
  const {
    currentPage,
    currentPerPage,
    defaultPage = 1,
    defaultPerPage,
  } = config;

  const hasDefaultPage = currentPage === defaultPage.toString();
  const hasDefaultPerPage = currentPerPage === defaultPerPage.toString();

  return hasDefaultPage || hasDefaultPerPage;
}

/**
 * Builds a clean URL by removing default parameter values
 *
 * @param config - URL cleanup configuration
 * @returns Clean URL path with query string (if needed)
 *
 * @example
 * ```tsx
 * buildCleanUrl({
 *   basePath: "/mailchimp/lists",
 *   currentPage: "1",
 *   currentPerPage: "25",
 *   defaultPage: 1,
 *   defaultPerPage: 10
 * }); // "/mailchimp/lists?perPage=25" (page=1 omitted)
 * ```
 */
export function buildCleanUrl(config: UrlCleanupConfig): string {
  const {
    basePath,
    currentPage,
    currentPerPage,
    defaultPage = 1,
    defaultPerPage,
    additionalParams,
  } = config;

  const cleanParams = new URLSearchParams();

  // Add page only if not default
  if (currentPage && currentPage !== defaultPage.toString()) {
    cleanParams.set("page", currentPage);
  }

  // Add perPage only if not default
  if (currentPerPage && currentPerPage !== defaultPerPage.toString()) {
    cleanParams.set("perPage", currentPerPage);
  }

  // Add additional params, filtering out undefined values
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanParams.set(key, value);
      }
    });
  }

  return `${basePath}${cleanParams.toString() ? `?${cleanParams}` : ""}`;
}

/**
 * Evaluates if a redirect is needed and returns the clean URL if so
 *
 * @param config - URL cleanup configuration
 * @returns Clean URL string if redirect is needed, null otherwise
 *
 * @example
 * ```tsx
 * const redirectUrl = getRedirectUrlIfNeeded({
 *   basePath: "/mailchimp/lists",
 *   currentPage: "1",
 *   currentPerPage: "10",
 *   defaultPerPage: 10
 * });
 *
 * if (redirectUrl) {
 *   redirect(redirectUrl);
 * }
 * ```
 */
export function getRedirectUrlIfNeeded(
  config: UrlCleanupConfig,
): string | null {
  if (shouldRedirectToCleanUrl(config)) {
    return buildCleanUrl(config);
  }
  return null;
}
