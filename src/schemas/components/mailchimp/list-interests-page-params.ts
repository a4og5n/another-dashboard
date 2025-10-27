/**
 * List Interests Page Params Schemas
 * Validation schemas for list interests page route and search params
 */

import { z } from "zod";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";

/**
 * Schema for list interests page route params
 * Validates the list id and interest_category_id from the URL
 */
export const listInterestsPageRouteParamsSchema = z.object({
  id: z.string().min(1, "List ID is required"),
  interest_category_id: z.string().min(1, "Interest category ID is required"),
});

/**
 * Schema for list interests page search params
 * Validates pagination parameters
 */
export const listInterestsPageSearchParamsSchema = z
  .object({
    page: z.string().optional(),
    perPage: z.string().optional(),
  })
  .transform((params) => {
    const page = params.page ? parseInt(params.page, 10) : 1;
    const perPage = params.perPage
      ? parseInt(params.perPage, 10)
      : PER_PAGE_OPTIONS[0];

    return {
      page: page > 0 ? page : 1,
      perPage: (PER_PAGE_OPTIONS as readonly number[]).includes(perPage)
        ? perPage
        : PER_PAGE_OPTIONS[0],
    };
  });

/**
 * Inferred TypeScript types from schemas
 */
export type ListInterestsPageRouteParams = z.infer<
  typeof listInterestsPageRouteParamsSchema
>;
export type ListInterestsPageSearchParams = z.infer<
  typeof listInterestsPageSearchParamsSchema
>;
