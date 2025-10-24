/**
 * List Members Page Params Schemas
 * Validation schemas for list-members page params and search params
 */

import { z } from "zod";

/**
 * Schema for page search params
 * Validates pagination parameters only
 */
export const listMembersPageParamsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
});

/**
 * Inferred TypeScript types from schemas
 */
export type ListMembersPageParams = z.infer<typeof listMembersPageParamsSchema>;
