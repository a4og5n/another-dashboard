/**
 * Date filtering component types
 * Shared types for components that use date range filtering
 */

import { DateRange } from "react-day-picker";

/**
 * Common props for components that support date range filtering
 * Used by date pickers, tables, and other filterable components
 */
export interface DateFilterProps {
  /** The selected date range */
  dateRange?: DateRange;
  /** Callback for when the date range changes (manual selection with submit) */
  onDateRangeChange?: (range: DateRange | undefined) => void;
  /** Callback for when a preset is selected (immediate execution) */
  onPresetSelect?: (range: DateRange | undefined) => void;
}

/**
 * Props for table components that support loading states
 */
export interface TableLoadingProps {
  /** Whether the table is in a loading state */
  loading?: boolean;
}

/**
 * Combined props for table components with date filtering and loading
 */
export interface TableWithDateFilterProps
  extends DateFilterProps,
    TableLoadingProps {}
