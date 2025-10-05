import { z } from "zod";

/**
 * Lists Page Search Params Schema
 * Validates URL search parameters for the lists page
 *
 * UI uses page/perPage, which get transformed to count/offset for the API
 */
export const listsPageSearchParamsSchema = z
  .object({
    page: z.string().optional(),
    perPage: z.string().optional(),
  })
  .strict();
