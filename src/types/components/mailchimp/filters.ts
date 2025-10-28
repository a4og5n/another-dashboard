/**
 * Mailchimp Filter Components Types
 * Type definitions for reusable filter UI components
 *
 * These types support both server and client component patterns:
 * - Server components: Use URL-based navigation (createXUrl functions)
 * - Client components: Use callback-based state updates (onChange functions)
 */

/**
 * Field Selector Component Props
 * Multi-select dropdown for choosing which API fields to include/exclude
 */
export interface FieldSelectorProps {
  /** Currently selected fields to include */
  selectedFields?: string[];
  /** Currently selected fields to exclude */
  excludedFields?: string[];
  /** Available field options (if not provided, uses free-form input) */
  availableFields?: readonly string[];
  /** Callback when selection changes (client components) */
  onChange?: (fields: { selected?: string[]; excluded?: string[] }) => void;
  /** URL generator for field changes (server components) */
  createFieldUrl?: (fields?: string, excludeFields?: string) => string;
  /** Component label */
  label?: string;
  /** Show include/exclude toggle */
  allowExclude?: boolean;
}

/**
 * Date Range Filter Component Props
 * Date picker pair for filtering by date ranges (since/before)
 */
export interface DateRangeFilterProps {
  /** Start date value (ISO 8601 datetime) */
  sinceValue?: string;
  /** End date value (ISO 8601 datetime) */
  beforeValue?: string;
  /** Callback when dates change (client components) */
  onChange?: (range: { since?: string; before?: string }) => void;
  /** URL generator for date changes (server components) */
  createDateUrl?: (since?: string, before?: string) => string;
  /** Filter label */
  label?: string;
  /** Include time picker (default: false, date only) */
  includeTime?: boolean;
  /** Field names for query params (default: since, before) */
  fieldNames?: {
    since?: string;
    before?: string;
  };
}

/**
 * Sorting Controls Component Props
 * Dropdown for selecting sort field and direction
 */
export interface SortingControlsProps {
  /** Current sort field */
  sortField?: string;
  /** Current sort direction */
  sortDirection?: "ASC" | "DESC";
  /** Available fields to sort by */
  availableFields: readonly string[];
  /** Callback when sorting changes (client components) */
  onChange?: (sort: { field?: string; direction?: "ASC" | "DESC" }) => void;
  /** URL generator for sort changes (server components) */
  createSortUrl?: (field?: string, direction?: "ASC" | "DESC") => string;
  /** Component label */
  label?: string;
  /** Field labels (maps field names to display labels) */
  fieldLabels?: Record<string, string>;
}

/**
 * Member Status Toggles Component Props
 * Checkbox toggles for including members with special statuses
 */
export interface MemberStatusTogglesProps {
  /** Include cleaned members */
  includeCleaned?: boolean;
  /** Include transactional members */
  includeTransactional?: boolean;
  /** Include unsubscribed members */
  includeUnsubscribed?: boolean;
  /** Callback when toggles change (client components) */
  onChange?: (status: {
    includeCleaned?: boolean;
    includeTransactional?: boolean;
    includeUnsubscribed?: boolean;
  }) => void;
  /** URL generator for status changes (server components) */
  createStatusUrl?: (
    includeCleaned?: boolean,
    includeTransactional?: boolean,
    includeUnsubscribed?: boolean,
  ) => string;
  /** Component label */
  label?: string;
  /** Show help text explaining each status */
  showHelp?: boolean;
}
