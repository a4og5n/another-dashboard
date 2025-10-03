import { z } from "zod";
import { REPORT_QUERY_TYPES } from "@/schemas/mailchimp/reports-params.schema";
import { PER_PAGE_OPTIONS } from "@/types/components/ui";

/**
 * Mailchimp Reports Page Query Parameters Schema
 * Validates query parameters for the reports page
 *
 * Follows project guidelines:
 * - Use schemas for all validation (no inline validation)
 * - Define proper error messages
 * - Support transformation and defaults
 */

/**
 * Schema for reports page URL search parameters
 */
export const reportsPageParamsSchema = z.object({
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
  type: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        REPORT_QUERY_TYPES.includes(val as (typeof REPORT_QUERY_TYPES)[number]),
      {
        message: `Report type must be one of: ${REPORT_QUERY_TYPES.join(", ")}`,
      },
    ),
  before_send_time: z.string().optional(),
  since_send_time: z.string().optional(),
});

/**
 * Inferred type from the schema
 */
export type ReportsPageParams = z.infer<typeof reportsPageParamsSchema>;
