/**
 * Page Parameter Processing Utilities
 *
 * Handles the common pattern of validating URL search params,
 * checking for redirects, and converting to API format.
 *
 * Flow: rawParams → validatedParams → convertedParams → apiParams
 */

import { redirect } from "next/navigation";
import type { ZodType } from "zod";
import { getRedirectUrlIfNeeded } from "@/utils/pagination-url-builders";
import { transformPaginationParams } from "@/utils/mailchimp/query-params";

/**
 * Result of validating and transforming page parameters
 *
 * This interface represents the complete output of the `validatePageParams` function,
 * providing both API-ready parameters and UI display values.
 *
 * @template T - UI parameter type (typically with `page?: string` and `perPage?: string`)
 * @template U - API parameter type (typically with `count?: number` and `offset?: number`)
 *
 * @example
 * ```typescript
 * // Typical return value structure
 * const result: ValidatedPageParams<ListsPageSearchParams, ListsParams> = {
 *   apiParams: { count: 20, offset: 20 },    // Ready for API call
 *   uiParams: { page: "2", perPage: "20" },  // Original validated params
 *   currentPage: 2,                          // Parsed integer for UI
 *   pageSize: 20                             // Parsed integer for UI
 * };
 * ```
 */
export interface ValidatedPageParams<T, U> {
  /**
   * Validated and transformed parameters ready for API calls
   *
   * These parameters have been converted from UI format (page/perPage)
   * to API format (count/offset) and validated against the API schema.
   *
   * @example { count: 20, offset: 20, type: "regular" }
   */
  apiParams: U;

  /**
   * Validated UI parameters from the URL query string
   *
   * These are the original parameters after validation but before
   * transformation, in string format as received from the URL.
   *
   * @example { page: "2", perPage: "20", type: "regular" }
   */
  uiParams: T;

  /**
   * Extracted current page number for UI display
   *
   * Parsed from `uiParams.page` or defaults to 1 if not present.
   * This is a convenience value for rendering pagination components.
   *
   * @example 2
   */
  currentPage: number;

  /**
   * Extracted page size for UI display
   *
   * Parsed from `uiParams.perPage` or defaults to the API schema default
   * (typically 10). This is a convenience value for rendering pagination components.
   *
   * @example 20
   */
  pageSize: number;
}

/**
 * Validate, transform, and redirect page parameters for paginated list pages
 *
 * This function handles the complete flow of URL parameter processing for pages
 * with pagination (`?page=N&perPage=M` query parameters). It validates params,
 * redirects to clean URLs when needed, transforms UI params to API format, and
 * returns both API-ready parameters and UI display values.
 *
 * **⚠️ CRITICAL: Schema Requirements**
 *
 * **UI Schema (uiSchema)** MUST use **optional strings**:
 * ```typescript
 * // ✅ CORRECT
 * export const myPageSearchParamsSchema = z.object({
 *   page: z.string().optional(),      // String from URL query params
 *   perPage: z.string().optional(),   // String from URL query params
 * }).strict();
 *
 * // ❌ WRONG - Will cause TypeScript errors
 * export const myPageSearchParamsSchema = z.object({
 *   page: z.coerce.number().optional(),     // Don't coerce in UI schema
 *   perPage: z.coerce.number().optional(),  // Don't coerce in UI schema
 * });
 * ```
 *
 * **API Schema (apiSchema)** SHOULD use **coerced numbers with defaults**:
 * ```typescript
 * // ✅ CORRECT
 * export const myApiParamsSchema = z.object({
 *   count: z.coerce.number().min(1).max(1000).default(10),
 *   offset: z.coerce.number().min(0).default(0),
 * }).strict();
 * ```
 *
 * **Why this matters:**
 * - URL params are always strings (`?page=2` → `"2"`)
 * - This function transforms strings to numbers internally
 * - Coercing in UI schema causes type mismatches
 *
 * **Processing Flow:**
 * 1. **Parse & Validate** - Await and validate raw URL search params using UI schema
 * 2. **Check Redirect** - Determine if URL cleanup is needed (remove default values)
 * 3. **Transform** - Convert UI params (`page`, `perPage`) to API params (`count`, `offset`)
 * 4. **Extract Display Values** - Parse integer values for currentPage and pageSize
 *
 * **When to use this utility:**
 * - Pages with `?page=N&perPage=M` query parameters
 * - List pages displaying paginated data (reports, lists, campaigns)
 * - Pages where you want clean URLs (automatic redirect when defaults present)
 *
 * **Related utilities:**
 * - For dynamic route params (`/lists/[id]`), use `processRouteParams()` instead
 * - See `src/utils/params/README.md` for complete decision guide
 *
 * @template T - UI parameter type (must include `page?: string` and `perPage?: string`)
 * @template U - API parameter type (must include `count?: number`)
 *
 * @param options - Configuration object
 * @param options.searchParams - Promise of raw URL search parameters from Next.js page props
 * @param options.uiSchema - Zod schema for validating UI parameters (e.g., `listsPageSearchParamsSchema`)
 * @param options.apiSchema - Zod schema for validating API parameters (e.g., `listsParamsSchema`)
 * @param options.basePath - Base URL path for redirect (e.g., `"/mailchimp/lists"`)
 * @param options.transformer - Optional function to convert UI params to API format (defaults to `transformPaginationParams`)
 *
 * @returns Promise resolving to validated parameters with API params, UI params, and display values
 *
 * @throws {ZodError} When validation fails (invalid param format or unrecognized keys)
 * @throws {Error} When redirect fails (handled by Next.js internally)
 *
 * @example
 * ```typescript
 * // Basic usage in a paginated list page
 * import { validatePageParams } from "@/utils/mailchimp/page-params";
 * import { listsPageSearchParamsSchema } from "@/schemas/components";
 * import { listsParamsSchema } from "@/schemas/mailchimp";
 *
 * async function ListsPageContent({ searchParams }: ListsPageProps) {
 *   const { apiParams, currentPage, pageSize } = await validatePageParams({
 *     searchParams,
 *     uiSchema: listsPageSearchParamsSchema,
 *     apiSchema: listsParamsSchema,
 *     basePath: "/mailchimp/lists",
 *   });
 *
 *   // Use apiParams for API call
 *   const response = await mailchimpDAL.fetchLists(apiParams);
 *
 *   // Use display values for UI
 *   return <ListsOverview data={response.data} currentPage={currentPage} pageSize={pageSize} />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // With custom transformer
 * const result = await validatePageParams({
 *   searchParams,
 *   uiSchema: reportsPageSearchParamsSchema,
 *   apiSchema: reportListParamsSchema,
 *   basePath: "/mailchimp/reports",
 *   transformer: transformCampaignReportsParams, // Custom transformer
 * });
 * ```
 *
 * @see {@link ValidatedPageParams} - Return type interface
 * @see {@link processRouteParams} - For dynamic route validation
 * @see `src/utils/params/README.md` - Complete usage guide
 */
export async function validatePageParams<
  T extends { page?: string; perPage?: string },
  U extends { count?: number },
>({
  searchParams,
  uiSchema,
  apiSchema,
  basePath,
  transformer = transformPaginationParams as unknown as (
    params: T,
  ) => Partial<U>,
}: {
  searchParams: Promise<unknown>;
  uiSchema: ZodType<T>;
  apiSchema: ZodType<U>;
  basePath: string;
  transformer?: (params: T) => Partial<U>;
}): Promise<ValidatedPageParams<T, U>> {
  // Parse and validate raw params from URL
  const rawParams = await searchParams;
  const validatedParams = uiSchema.parse(rawParams);

  // Extract additional params (non-pagination params) to preserve during redirect
  const {
    page: _page,
    perPage: _perPage,
    ...additionalParams
  } = validatedParams;
  const additionalParamsRecord: Record<string, string | undefined> = {};

  // Convert additional params to string record
  Object.entries(additionalParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      additionalParamsRecord[key] = String(value);
    }
  });

  // Check for redirect based on defaults (to clean URL)
  const defaults = apiSchema.parse({});
  const defaultCount = defaults.count ?? 10;
  const redirectUrl = getRedirectUrlIfNeeded({
    basePath,
    currentPage: validatedParams.page,
    currentPerPage: validatedParams.perPage,
    defaultPerPage: defaultCount,
    additionalParams: additionalParamsRecord,
  });

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  // Convert validated params to API format
  const convertedParams = transformer(validatedParams);
  const apiParams = apiSchema.parse(convertedParams);

  // Extract UI display values
  const currentPage = parseInt(validatedParams.page || "1");
  const pageSize = parseInt(validatedParams.perPage || defaultCount.toString());

  return {
    apiParams,
    uiParams: validatedParams,
    currentPage,
    pageSize,
  };
}
