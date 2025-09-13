/**
 * PerPageSelectorProps type for PerPageSelector component
 * Supports both callback-based and URL-based navigation
 */
export interface PerPageSelectorProps {
  value: number;
  options: number[];
  /** Callback function for value changes (used in client components) */
  onChange?: (value: number) => void;
  /** URL generator function for per-page links (used in server components) */
  createPerPageUrl?: (perPage: number) => string;
  /** Optional: customize the "per page" text (default: "campaigns per page") */
  itemName?: string;
}
