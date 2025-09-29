/**
 * Reports Table Component Types
 * Type definitions for reports table components
 *
 * Following project guidelines to define shared types in /src/types
 */

import type { TableWithDateFilterProps } from "@/types/components/ui";

/**
 * Props for the ReportsTable component
 * Extends shared date filtering and loading props
 */
export interface ReportsTableProps extends TableWithDateFilterProps {
  /**
   * Reports data to display in the table.
   * Validated with Zod schema for safety. Accepts any input, but only valid reports are rendered.
   * If validation fails, the table will be empty and no runtime error will occur.
   *
   * @see CampaignSchema for validation
   * @example
   * <ReportsTable campaigns={dataFromApi} />
   */
  campaigns: unknown;
}
