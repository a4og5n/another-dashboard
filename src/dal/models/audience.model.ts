/**
 * Mailchimp Audience Data Model
 *
 * Defines the data structure for Mailchimp Audiences with validation schemas
 * and TypeScript types for use in the Data Access Layer.
 */

import { z } from "zod";
import { MailchimpAudienceSchema } from "@/schemas/mailchimp/audience.schema";

/**
 * Database model schema for persisting Mailchimp Audience data
 * Extends the API schema with additional fields for database operations
 */
export const AudienceModelSchema = MailchimpAudienceSchema.extend({
  // Database-specific fields
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  last_synced_at: z.string().datetime().optional(),
  sync_status: z
    .enum(["pending", "syncing", "completed", "failed"])
    .default("pending"),
  is_deleted: z.boolean().default(false),

  // Cached metadata for performance
  cached_member_count: z.number().int().min(0).optional(),
  cached_stats: z
    .object({
      last_updated: z.string().datetime(),
      member_count: z.number().int().min(0),
      growth_rate: z.number().optional(),
      engagement_rate: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

/**
 * TypeScript type for the complete audience model
 */
export type AudienceModel = z.infer<typeof AudienceModelSchema>;

/**
 * Schema for creating a new audience record in the database
 */
export const CreateAudienceModelSchema = AudienceModelSchema.omit({
  created_at: true,
  updated_at: true,
}).extend({
  // Required fields for creation
  id: z.string().min(1, "Audience ID is required"),
  name: z.string().min(1, "Audience name is required"),
});

/**
 * TypeScript type for creating audience records
 */
export type CreateAudienceModel = z.infer<typeof CreateAudienceModelSchema>;

/**
 * Schema for updating audience records in the database
 */
export const UpdateAudienceModelSchema = AudienceModelSchema.partial().extend({
  id: z.string().min(1, "Audience ID is required"),
  updated_at: z.string().datetime().optional(),
});

/**
 * TypeScript type for updating audience records
 */
export type UpdateAudienceModel = z.infer<typeof UpdateAudienceModelSchema>;

/**
 * Schema for audience query filters in the database
 */
export const AudienceQueryFiltersSchema = z.object({
  // Basic filters
  ids: z.array(z.string()).optional(),
  name_contains: z.string().optional(),
  visibility: z.enum(["pub", "prv"]).optional(),

  // Status filters
  sync_status: z.enum(["pending", "syncing", "completed", "failed"]).optional(),
  is_deleted: z.boolean().optional(),

  // Date filters
  created_after: z.string().datetime().optional(),
  created_before: z.string().datetime().optional(),
  last_synced_after: z.string().datetime().optional(),
  last_synced_before: z.string().datetime().optional(),

  // Performance filters
  min_member_count: z.number().int().min(0).optional(),
  max_member_count: z.number().int().min(0).optional(),
  min_engagement_rate: z.number().min(0).max(1).optional(),

  // Pagination
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
  sort_by: z
    .enum([
      "created_at",
      "updated_at",
      "name",
      "member_count",
      "engagement_rate",
    ])
    .default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * TypeScript type for audience query filters
 */
export type AudienceQueryFilters = z.infer<typeof AudienceQueryFiltersSchema>;

/**
 * Schema for audience aggregate statistics
 */
export const AudienceStatsSchema = z.object({
  total_audiences: z.number().int().min(0),
  total_members: z.number().int().min(0),
  avg_member_count: z.number().min(0),
  avg_engagement_rate: z.number().min(0).max(1),
  audiences_by_status: z.object({
    pending: z.number().int().min(0),
    syncing: z.number().int().min(0),
    completed: z.number().int().min(0),
    failed: z.number().int().min(0),
  }),
  audiences_by_visibility: z.object({
    pub: z.number().int().min(0),
    prv: z.number().int().min(0),
  }),
  last_updated: z.string().datetime(),
});

/**
 * TypeScript type for audience statistics
 */
export type AudienceStats = z.infer<typeof AudienceStatsSchema>;

/**
 * Validation helper functions
 */
export const AudienceModelValidators = {
  /**
   * Validates audience model data
   */
  validateModel: (data: unknown): AudienceModel => {
    const result = AudienceModelSchema.safeParse(data);
    if (!result.success) {
      throw new Error(`Invalid audience model: ${result.error.message}`);
    }
    return result.data;
  },

  /**
   * Validates create audience data
   */
  validateCreate: (data: unknown): CreateAudienceModel => {
    const result = CreateAudienceModelSchema.safeParse(data);
    if (!result.success) {
      throw new Error(`Invalid create audience data: ${result.error.message}`);
    }
    return result.data;
  },

  /**
   * Validates update audience data
   */
  validateUpdate: (data: unknown): UpdateAudienceModel => {
    const result = UpdateAudienceModelSchema.safeParse(data);
    if (!result.success) {
      throw new Error(`Invalid update audience data: ${result.error.message}`);
    }
    return result.data;
  },

  /**
   * Validates query filters
   */
  validateFilters: (data: unknown): AudienceQueryFilters => {
    const result = AudienceQueryFiltersSchema.safeParse(data);
    if (!result.success) {
      throw new Error(`Invalid query filters: ${result.error.message}`);
    }
    return result.data;
  },
};
