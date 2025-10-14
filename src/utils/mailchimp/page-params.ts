/**
 * Page Parameter Processing Utilities
 *
 * Handles the common pattern of validating URL search params,
 * checking for redirects, and converting to API format.
 *
 * Flow: rawParams → validatedParams → convertedParams → apiParams
 */

import { redirect } from "next/navigation";
import type { ZodSchema } from "zod";
import { getRedirectUrlIfNeeded } from "@/utils/pagination-url-builders";
import { transformPaginationParams } from "@/utils/mailchimp/query-params";

/**
 * Result of processing page parameters
 */
export interface ProcessPageParamsResult<T, U> {
  /** Validated and converted parameters ready for API calls */
  apiParams: U;
  /** Parsed UI parameters (page, perPage, etc.) */
  validatedParams: T;
  /** Extracted currentPage number for UI display */
  currentPage: number;
  /** Extracted pageSize number for UI display */
  pageSize: number;
}

/**
 * Process page parameters: validate, check redirect, convert to API format
 *
 * This function handles the complete flow of URL parameter processing:
 * 1. Parse and validate raw params from URL
 * 2. Check if redirect is needed (to clean default values from URL)
 * 3. Convert validated params to API format
 * 4. Extract UI display values (currentPage, pageSize)
 *
 * @param options Configuration object
 * @param options.searchParams Promise of raw URL search parameters
 * @param options.uiSchema Zod schema for validating UI parameters
 * @param options.apiSchema Zod schema for validating API parameters
 * @param options.basePath Base URL path for redirect (e.g., "/mailchimp/lists")
 * @param options.transformer Optional function to convert UI params to API format
 * @returns Processed parameters ready for API and UI
 *
 * @example
 * ```typescript
 * const result = await processPageParams({
 *   searchParams,
 *   uiSchema: listsPageSearchParamsSchema,
 *   apiSchema: listsParamsSchema,
 *   basePath: "/mailchimp/lists",
 * });
 *
 * const response = await mailchimpDAL.fetchLists(result.apiParams);
 * ```
 */
export async function processPageParams<
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
  uiSchema: ZodSchema<T>;
  apiSchema: ZodSchema<U>;
  basePath: string;
  transformer?: (params: T) => Partial<U>;
}): Promise<ProcessPageParamsResult<T, U>> {
  // Parse and validate raw params from URL
  const rawParams = await searchParams;
  const validatedParams = uiSchema.parse(rawParams);

  // Check for redirect based on defaults (to clean URL)
  const defaults = apiSchema.parse({});
  const defaultCount = defaults.count ?? 10;
  const redirectUrl = getRedirectUrlIfNeeded({
    basePath,
    currentPage: validatedParams.page,
    currentPerPage: validatedParams.perPage,
    defaultPerPage: defaultCount,
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
    validatedParams,
    currentPage,
    pageSize,
  };
}
