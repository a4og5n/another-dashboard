/**
 * Mailchimp Audience Data Model
 *
 * Data Access Layer functionality for Mailchimp Audiences.
 * Types and schemas are now organized in their proper directories:
 * - Types: @/types/mailchimp/audience
 * - Schemas: @/schemas/mailchimp/audience.schema
 */

// Re-export types and schemas from their proper locations
export type {
  AudienceModel,
  AudienceQueryFilters,
  AudienceStats,
} from "@/types/mailchimp/audience";

export {
  AudienceModelSchema,
  AudienceQueryFiltersSchema,
  AudienceStatsSchema,
  AudienceModelValidators,
} from "@/schemas/mailchimp/audience.schema";
