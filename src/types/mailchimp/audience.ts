import type { z } from "zod";
import type {
  AudienceQueryFiltersSchema,
  AudienceStatsSchema,
} from "@/schemas/mailchimp/audience.schema";

/**
 * TypeScript type for audience query filters
 */
export type AudienceQueryFilters = z.infer<typeof AudienceQueryFiltersSchema>;

/**
 * TypeScript type for audience statistics
 */
export type AudienceStats = z.infer<typeof AudienceStatsSchema>;

/**
 * Query parameters for fetching audiences
 */
export interface MailchimpAudiencesQuery {
  fields?: string[];
  exclude_fields?: string[];
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
  loading?: boolean;
  className?: string;
}
