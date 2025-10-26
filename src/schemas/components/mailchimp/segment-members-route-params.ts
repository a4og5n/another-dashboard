/**
 * Segment Members Route Params Schema
 * Validation schema for segment-members page route parameters
 */

import { z } from "zod";

/**
 * Schema for route parameters
 * Validates both list ID and segment ID from the route
 */
export const segmentMembersRouteParamsSchema = z.object({
  id: z.string().min(1), // List ID from route
  segment_id: z.string().min(1), // Segment ID from route
});

/**
 * Inferred TypeScript types from schemas
 */
export type SegmentMembersRouteParams = z.infer<
  typeof segmentMembersRouteParamsSchema
>;
