/**
 * TypeScript types for List Segments endpoint
 * Generated from Zod schemas in src/schemas/mailchimp/lists/segments/
 *
 * @see src/schemas/mailchimp/lists/segments/params.schema.ts
 * @see src/schemas/mailchimp/lists/segments/success.schema.ts
 * @see src/schemas/mailchimp/lists/segments/error.schema.ts
 */

import type { z } from "zod";
import type {
  listSegmentsPathParamsSchema,
  listSegmentsQueryParamsSchema,
} from "@/schemas/mailchimp/lists/segments/params.schema";
import type {
  listSegmentsSuccessSchema,
  segmentSchema,
  segmentOptionsSchema,
  segmentConditionSchema,
} from "@/schemas/mailchimp/lists/segments/success.schema";
import type { listSegmentsErrorSchema } from "@/schemas/mailchimp/lists/segments/error.schema";

/**
 * Path parameters for list segments endpoint
 */
export type ListSegmentsPathParams = z.infer<
  typeof listSegmentsPathParamsSchema
>;

/**
 * Query parameters for list segments endpoint
 */
export type ListSegmentsQueryParams = z.infer<
  typeof listSegmentsQueryParamsSchema
>;

/**
 * Combined params (path + query)
 */
export type ListSegmentsParams = ListSegmentsPathParams &
  ListSegmentsQueryParams;

/**
 * Success response from list segments endpoint
 * Returns paginated list of segments
 */
export type ListSegmentsResponse = z.infer<typeof listSegmentsSuccessSchema>;

/**
 * Individual segment data
 */
export type Segment = z.infer<typeof segmentSchema>;

/**
 * Segment options (conditions and match type)
 */
export type SegmentOptions = z.infer<typeof segmentOptionsSchema>;

/**
 * Individual segment condition
 */
export type SegmentCondition = z.infer<typeof segmentConditionSchema>;

/**
 * Error response from list segments endpoint
 */
export type ListSegmentsError = z.infer<typeof listSegmentsErrorSchema>;
