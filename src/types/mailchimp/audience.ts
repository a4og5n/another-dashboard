import type { z } from "zod";
import type { AudienceStatsSchema } from "@/schemas/mailchimp/audience.schema";
import type {
  MailchimpAudienceSimplified,
  MailchimpAudienceSuccessSchema,
} from "@/schemas/mailchimp/audience-success.schema";

/**
 * TypeScript type for audience statistics
 */
export type AudienceStats = z.infer<typeof AudienceStatsSchema>;

/**
 * Enhanced audience types with _links support
 * Issue #127: Updated for enhanced schemas with _links
 */
export type MailchimpAudience = z.infer<typeof MailchimpAudienceSimplified>;
export type MailchimpAudienceSuccess = z.infer<
  typeof MailchimpAudienceSuccessSchema
>;

/**
 * Query parameters for fetching audiences
 */
export interface MailchimpAudiencesQuery {
  fields?: string; // Comma-separated list of fields to include
  exclude_fields?: string; // Comma-separated list of fields to exclude
  count?: number;
  offset?: number;
  before_date_created?: string;
  since_date_created?: string;
  before_campaign_last_sent?: string;
  since_campaign_last_sent?: string;
  email?: string;
  sort_field?: "date_created" | "member_count";
  sort_dir?: "ASC" | "DESC";
}

/**
 * Props for AudienceStats component
 */
export interface AudienceStatsProps {
  stats: AudienceStats;
  className?: string;
}
