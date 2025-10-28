/**
 * Landing Pages Query Parameters Schema
 * Schema for query parameters when fetching landing pages list
 *
 * Endpoint: GET /landing-pages
 * Documentation: https://mailchimp.com/developer/marketing/api/landing-pages/list-landing-pages/
 *
 * Note: This endpoint does NOT support offset pagination - only count is supported
 */

import { z } from "zod";
import { fieldFilteringQueryParamsSchema } from "@/schemas/mailchimp/common/pagination-params.schema";
import { sortDirectionSchema } from "@/schemas/mailchimp/common/sorting.schema";

/**
 * Sort field for landing pages
 */
export const LANDING_PAGE_SORT_FIELDS = ["created_at", "updated_at"] as const;

/**
 * Landing pages query parameters schema
 * Does NOT include offset - this endpoint only supports count-based limiting
 */
export const landingPagesQueryParamsSchema = z
  .object({
    ...fieldFilteringQueryParamsSchema.shape, // fields, exclude_fields
    count: z.coerce.number().min(1).max(1000).default(10), // Number of records (1-1000)
    sort_dir: sortDirectionSchema, // Sort direction (ASC or DESC)
    sort_field: z.enum(LANDING_PAGE_SORT_FIELDS).optional(), // Sort field
  })
  .strict(); // Reject unknown properties for input validation
