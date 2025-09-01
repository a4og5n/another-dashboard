import type { z } from "zod";
import type { MailchimpAudienceSchema } from "@/schemas/mailchimp/audience.schema";
import type { AudienceFormData } from "@/schemas/mailchimp/audience-form.schema";
import type {
  AudienceModel,
  AudienceQueryFilters,
  AudienceStats,
  CreateAudienceModel,
  UpdateAudienceModel,
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
export type MailchimpAudienceMarketingPermission = NonNullable<
  MailchimpAudience["marketing_permissions"]
>[0];

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
 * Parameters for creating a new audience
 */
export interface CreateMailchimpAudienceParams {
  name: string;
  contact: MailchimpAudienceContact;
  permission_reminder: string;
  campaign_defaults: MailchimpAudienceCampaignDefaults;
  email_type_option: boolean;
  use_archive_bar?: boolean;
  notify_on_subscribe?: string;
  notify_on_unsubscribe?: string;
  visibility?: "pub" | "prv";
}

/**
 * Parameters for updating an existing audience
 */
export interface UpdateMailchimpAudienceParams
  extends Partial<CreateMailchimpAudienceParams> {
  id: string;
}

/**
 * Form data interface for audience creation/editing
 * Re-exported from schema for consistency
 */
export type { AudienceFormData };

/**
 * Form errors interface for audience form validation
 */
export interface AudienceFormErrors {
  [key: string]: string;
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

/**
 * Props for AudienceForm component
 */
export interface AudienceFormProps {
  audience?: Partial<CreateAudienceModel>;
  mode: "create" | "edit";
  loading?: boolean;
  onSubmit: (data: CreateAudienceModel | UpdateAudienceModel) => void;
  onCancel: () => void;
  className?: string;
}

/**
 * Props for AudienceDetails component
 */
export interface AudienceDetailsProps {
  audience: AudienceModel;
  growthData?: AudienceGrowthData[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onArchive?: (id: string) => void;
  onRefresh?: (id: string) => void;
  className?: string;
}
