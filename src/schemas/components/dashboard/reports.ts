import { z } from "zod";

/**
 * Base schema for required ReportsTable props
 */
export const reportsTableRequiredPropsSchema = z.object({
  /** Array of campaign reports to display */
  reports: z.array(z.any()), // Will be properly typed when reports schema is defined
});

/**
 * Schema for optional ReportsTable props with defaults
 */
export const reportsTableOptionalPropsSchema = z.object({
  /** Whether the component is in a loading state */
  loading: z.boolean().default(false),
  /** Error message to display, if any */
  error: z.string().nullable().default(null),
  /** Current page number for pagination */
  currentPage: z.number().int().min(1).default(1),
  /** Total number of pages available */
  totalPages: z.number().int().min(1).default(1),
  /** Number of items to display per page */
  perPage: z.number().int().min(1).max(100).default(10),
  /** Available options for items per page */
  perPageOptions: z
    .array(z.number().int().min(1).max(100))
    .default([10, 20, 50]),
  /** Callback function when page changes */
  onPageChange: z.any().optional(), // Using z.any() for function types to avoid complexity
  /** Callback function when per page selection changes */
  onPerPageChange: z.any().optional(), // Using z.any() for function types to avoid complexity
});

/**
 * Full schema for ReportsTable component props
 * Merges required and optional props for validation and default values
 */
export const reportsTablePropsSchema = reportsTableRequiredPropsSchema.merge(
  reportsTableOptionalPropsSchema,
);

// Type definition moved to '@/types/components/dashboard/reports'
