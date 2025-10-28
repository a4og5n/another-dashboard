/**
 * Member Status Inclusion Filter Schemas for Mailchimp API
 * Reusable member status filtering patterns
 *
 * Used by endpoints that need to include/exclude members based on status:
 * - lists/segments/params.schema.ts
 * - lists/segments/members/params.schema.ts (future)
 * - lists/members/params.schema.ts (potential)
 *
 * These filters control whether to include members with special statuses
 * that are normally excluded from results by default.
 *
 * Related: Issue #252 (Filter System Standardization)
 */
import { z } from "zod";

/**
 * Member status inclusion filters
 * Controls inclusion of members with special statuses
 *
 * All filters use z.coerce.boolean() for proper query parameter parsing
 * (query params come as strings "true"/"false", need coercion to boolean)
 *
 * @example
 * ```typescript
 * // Extend segment query params with status filters
 * export const queryParamsSchema = z.object({
 *   ...standardQueryParamsSchema.shape,
 *   ...memberStatusInclusionSchema.shape,
 * });
 * ```
 */
export const memberStatusInclusionSchema = z.object({
  include_cleaned: z.coerce.boolean().optional(), // Include cleaned members
  include_transactional: z.coerce.boolean().optional(), // Include transactional members
  include_unsubscribed: z.coerce.boolean().optional(), // Include unsubscribed members
});

/**
 * Individual member status filter schemas
 * Use when only specific status filters are needed
 */
export const includeCleanedSchema = z.object({
  include_cleaned: z.coerce.boolean().optional(), // Include cleaned members
});

export const includeTransactionalSchema = z.object({
  include_transactional: z.coerce.boolean().optional(), // Include transactional members
});

export const includeUnsubscribedSchema = z.object({
  include_unsubscribed: z.coerce.boolean().optional(), // Include unsubscribed members
});

/**
 * Member status type for use in UI components
 * Extracted from the schema for type safety
 */
export type MemberStatusInclusion = z.infer<typeof memberStatusInclusionSchema>;
