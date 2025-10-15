import { z } from "zod";
import { PER_PAGE_OPTIONS } from "@/types/components/ui";

/**
 * Abuse Reports Page Parameters Schema
 * Validates parameters for the abuse reports page
 *
 * Follows project guidelines:
 * - Use schemas for all validation (no inline validation)
 * - Define proper error messages
 * - Support transformation and defaults
 */

/**
 * Schema for abuse reports page route parameters (dynamic segments)
 */
export const abuseReportsPageParamsSchema = z.object({
  id: z.string().min(1, "Campaign ID is required"),
});

/**
 * Schema for abuse reports page URL search parameters
 */
export const abuseReportsPageSearchParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .refine((val) => Number.isInteger(val) && val >= 1, {
      message: "Page must be a positive integer",
    }),
  perPage: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .refine(
      (val) =>
        PER_PAGE_OPTIONS.includes(val as (typeof PER_PAGE_OPTIONS)[number]),
      {
        message: `Per page must be one of: ${PER_PAGE_OPTIONS.join(", ")}`,
      },
    ),
});

/**
 * Inferred types from the schemas
 */
export type AbuseReportsPageParams = z.infer<
  typeof abuseReportsPageParamsSchema
>;
export type AbuseReportsPageSearchParams = z.infer<
  typeof abuseReportsPageSearchParamsSchema
>;
