import { z } from "zod";

/**
 * Reports Page Search Params Schema
 * Validates URL search parameters for the reports page
 *
 * UI uses page/perPage, which get transformed to count/offset for the API
 * Additional filters (type, before_send_time, since_send_time) are passed through
 */
export const reportsPageSearchParamsSchema = z
  .object({
    page: z.string().optional(),
    perPage: z.string().optional(),
    type: z.string().optional(),
    before_send_time: z.string().optional(),
    since_send_time: z.string().optional(),
  })
  .strict();
