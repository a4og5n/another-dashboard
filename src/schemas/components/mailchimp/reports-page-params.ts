import { z } from "zod";
import { validDate } from "@/utils/mailchimp/query-params";

/**
 * Reports Page Search Params Schema
 * Validates URL search parameters for the reports page
 *
 * UI uses page/perPage, which get transformed to count/offset for the API
 * Additional filters (type, before_send_time, since_send_time) are passed through
 *
 * Date filters:
 * - from/to: UI-friendly YYYY-MM-DD format (converted to ISO 8601 in transformer)
 * - before_send_time/since_send_time: Direct API params (backward compatibility)
 */
export const reportsPageSearchParamsSchema = z
  .object({
    page: z.string().optional(),
    perPage: z.string().optional(),
    type: z.string().optional(),
    // Direct API params (backward compatibility)
    before_send_time: z.string().optional(),
    since_send_time: z.string().optional(),
    // UI-friendly date filters (YYYY-MM-DD format)
    from: z.string().refine(validDate, "Invalid from date format").optional(),
    to: z.string().refine(validDate, "Invalid to date format").optional(),
  })
  .strict();
