/**
 * Segment Members Page Params Schemas
 * Validation schemas for segment-members page params and search params
 */

import { z } from "zod";

/**
 * Schema for page search params
 * Validates pagination parameters only
 */
export const segmentMembersPageParamsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
});

/**
 * Inferred TypeScript types from schemas
 */
export type SegmentMembersPageParams = z.infer<
  typeof segmentMembersPageParamsSchema
>;
