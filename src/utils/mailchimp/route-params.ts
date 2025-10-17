/**
 * Route Parameter Processing Utilities
 *
 * Handles validation of dynamic route parameters (e.g., [id]) and search parameters
 * for detail pages. Automatically triggers 404 errors for invalid parameters.
 *
 * Flow: rawParams → safeParse → notFound() OR return validated data
 */

import { notFound } from "next/navigation";
import { z } from "zod";

/**
 * Validate route parameters and search parameters for dynamic routes
 *
 * This function validates both route parameters (dynamic segments like `[id]`) and
 * search parameters (query strings like `?tab=overview`) for detail pages. It uses
 * Zod schemas for validation and automatically triggers Next.js `notFound()` for
 * invalid parameters, ensuring proper 404 status codes.
 *
 * **Processing Flow:**
 * 1. **Await Promises** - Resolve both params and searchParams promises
 * 2. **Validate Route Params** - Use `safeParse` on route params, trigger 404 if invalid
 * 3. **Validate Search Params** - Use `safeParse` on search params, trigger 404 if invalid
 * 4. **Return Validated Data** - Return type-safe validated data for both param types
 *
 * **When to use this utility:**
 * - Pages with dynamic route segments (e.g., `/reports/[id]`, `/lists/[id]`)
 * - Detail pages that display a single resource by ID
 * - Pages where invalid IDs should return 404 errors (not 500 errors)
 *
 * **Related utilities:**
 * - For pagination params (`?page=N&perPage=M`), use `validatePageParams()` instead
 * - See `src/utils/params/README.md` for complete decision guide
 *
 * **IMPORTANT:** This function must be called BEFORE any Suspense boundaries to ensure
 * `notFound()` works correctly and returns proper 404 HTTP status codes.
 *
 * @template T - Route parameter type (e.g., `{ id: string }`)
 * @template U - Search parameter type (e.g., `{ tab: "overview" | "details" }`)
 *
 * @param options - Configuration object
 * @param options.params - Promise of route parameters from Next.js page props (e.g., `{ id: "abc123" }`)
 * @param options.searchParams - Promise of search parameters from Next.js page props (e.g., `{ tab: "overview" }`)
 * @param options.paramsSchema - Zod schema for validating route parameters (e.g., `reportPageParamsSchema`)
 * @param options.searchParamsSchema - Zod schema for validating search parameters (e.g., `reportPageSearchParamsSchema`)
 *
 * @returns Object containing validated route params and search params with full type safety
 *
 * @throws Triggers `notFound()` when validation fails (returns 404 response, not thrown exception)
 *
 * @example
 * ```typescript
 * // Basic usage in a dynamic route page
 * import { processRouteParams } from "@/utils/mailchimp/route-params";
 * import {
 *   reportPageParamsSchema,
 *   reportPageSearchParamsSchema
 * } from "@/schemas/components";
 *
 * export default async function CampaignReportPage({
 *   params,
 *   searchParams,
 * }: ReportPageProps) {
 *   // Validate BEFORE Suspense boundary for proper 404 handling
 *   const { validatedParams, validatedSearchParams } = await processRouteParams({
 *     params,
 *     searchParams,
 *     paramsSchema: reportPageParamsSchema,
 *     searchParamsSchema: reportPageSearchParamsSchema,
 *   });
 *
 *   // Use validated ID to fetch data
 *   const response = await mailchimpDAL.fetchCampaignReport(validatedParams.id);
 *
 *   // Use validated tab for UI
 *   return <CampaignReportDetail report={response.data} activeTab={validatedSearchParams.tab} />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // With no search params (define empty schema in schemas file)
 * import { emptySearchParamsSchema } from "@/schemas/components";
 *
 * const { validatedParams } = await processRouteParams({
 *   params,
 *   searchParams: Promise.resolve({}),
 *   paramsSchema: listPageParamsSchema,
 *   searchParamsSchema: emptySearchParamsSchema,
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Combined with validatePageParams for paginated detail pages
 * // Step 1: Validate route params first
 * import { emptySearchParamsSchema } from "@/schemas/components";
 *
 * const { validatedParams } = await processRouteParams({
 *   params,
 *   searchParams: Promise.resolve({}),
 *   paramsSchema: reportOpensPageParamsSchema,
 *   searchParamsSchema: emptySearchParamsSchema,
 * });
 *
 * // Step 2: Then validate pagination search params
 * const { apiParams, currentPage, pageSize } = await validatePageParams({
 *   searchParams,
 *   uiSchema: reportOpensPageSearchParamsSchema,
 *   apiSchema: reportOpensApiParamsSchema,
 *   basePath: `/mailchimp/reports/${validatedParams.id}/opens`,
 * });
 * ```
 *
 * @see {@link validatePageParams} - For pagination parameter validation
 * @see `src/utils/params/README.md` - Complete usage guide
 * @see [Next.js notFound()](https://nextjs.org/docs/app/api-reference/functions/not-found) - Official Next.js docs
 */
export async function processRouteParams<T, U>({
  params,
  searchParams,
  paramsSchema,
  searchParamsSchema,
}: {
  params: Promise<unknown>;
  searchParams: Promise<unknown>;
  paramsSchema: z.ZodType<T>;
  searchParamsSchema: z.ZodType<U>;
}): Promise<{
  /** Validated route parameters (e.g., { id: "abc123" }) */
  validatedParams: T;
  /** Validated search parameters (e.g., { tab: "overview" }) */
  validatedSearchParams: U;
}> {
  const rawParams = await params;
  const rawSearchParams = await searchParams;

  // Validate params - trigger 404 for invalid route parameters
  const paramsResult = paramsSchema.safeParse(rawParams);
  if (!paramsResult.success) {
    notFound();
  }

  // Validate search params - use safeParse to handle gracefully
  const searchParamsResult = searchParamsSchema.safeParse(rawSearchParams);
  if (!searchParamsResult.success) {
    notFound();
  }

  return {
    validatedParams: paramsResult.data,
    validatedSearchParams: searchParamsResult.data,
  };
}
