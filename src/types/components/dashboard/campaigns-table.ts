/**
 * Campaigns Table Component Types
 * Type definitions for campaign table components
 *
 * Following project guidelines to define shared types in /src/types
 */

import type { TableWithDateFilterProps } from "@/types/components/ui";

/**
 * Props for the CampaignsTable component
 * Extends shared date filtering and loading props
 */
export interface CampaignsTableProps extends TableWithDateFilterProps {
  /**
   * Campaigns data to display in the table.
   * Validated with Zod schema for safety. Accepts any input, but only valid campaigns are rendered.
   * If validation fails, the table will be empty and no runtime error will occur.
   *
   * @see CampaignSchema for validation
   * @example
   * <CampaignsTable campaigns={dataFromApi} />
   */
  campaigns: unknown;
}
