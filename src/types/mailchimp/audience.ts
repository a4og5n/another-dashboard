import type { z } from "zod";
import type { MailchimpAudienceSchema } from "@/schemas/mailchimp/audience.schema";
import type {
  AudienceModel,
  AudienceQueryFilters,
  AudienceStats,
} from "@/dal/models/audience.model";

/**
 * TypeScript types for Mailchimp Audience objects
 * Generated from Zod schemas in @/schemas/mailchimp/audience.schema
 */

export type MailchimpAudience = z.infer<typeof MailchimpAudienceSchema>;

export type MailchimpAudienceContact = MailchimpAudience["contact"];
export type MailchimpAudienceCampaignDefaults =
  MailchimpAudience["campaign_defaults"];
export type MailchimpAudienceStats = MailchimpAudience["stats"];
// Marketing permissions structure is unknown, using generic type
export type MailchimpAudienceMarketingPermission = {
  marketing_permission_id: string;
  text: string;
  enabled: boolean;
};

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
 * Response structure for audiences list API
 */
export interface MailchimpAudiencesResponse {
  lists: MailchimpAudience[];
  total_items: number;
  constraints: {
    may_create: boolean;
    max_instances: number;
    current_total_instances: number;
  };
}

/**
 * Growth data interface for audience statistics
 */
export interface AudienceGrowthData {
  date: string;
  member_count: number;
}

/**
 * Component Props Interfaces
 */

/**
 * Props for AudienceCard component
 */
export interface AudienceCardProps {
  audience: AudienceModel;
  onEdit?: (id: string) => void;
  onArchive?: (id: string) => void;
  onViewStats?: (id: string) => void;
  className?: string;
}

/**
 * Props for AudienceList component
 */
export interface AudienceListProps {
  audiences: AudienceModel[];
  totalCount: number;
  loading?: boolean;
  error?: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  // Filtering and sorting
  filters: Partial<AudienceQueryFilters>;
  onFiltersChange: (filters: Partial<AudienceQueryFilters>) => void;

  // Actions
  onCreateAudience?: () => void;
  onEditAudience?: (id: string) => void;
  onArchiveAudience?: (id: string) => void;
  onViewStats?: (id: string) => void;

  // Display options
  className?: string;
}

/**
 * Props for AudienceStats component
 */
export interface AudienceStatsProps {
  stats: AudienceStats;
  loading?: boolean;
  className?: string;
}
