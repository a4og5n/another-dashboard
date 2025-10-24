/**
 * Member Profile Page Params Schemas
 * Validation schemas for member-info page params and search params
 */

import { z } from "zod";

/**
 * Schema for member profile page route params
 * Validates the id and subscriber_hash from the URL
 */
export const memberProfilePageParamsSchema = z.object({
  id: z.string().min(1, "List ID is required"),
  subscriber_hash: z.string().min(1, "Subscriber hash is required"),
});

/**
 * Inferred TypeScript types from schemas
 */
export type MemberProfilePageParams = z.infer<
  typeof memberProfilePageParamsSchema
>;
