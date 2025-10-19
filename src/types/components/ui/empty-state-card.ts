/**
 * Types for EmptyStateCard component
 *
 * Generic empty state card component for consistent empty/error states across the dashboard
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Visual variant for the empty state card
 * - empty: Default muted styling for empty states
 * - success: Green styling for positive empty states (e.g., no spam reports)
 * - error: Red styling for error states
 */
export type EmptyStateVariant = "empty" | "success" | "error";

/**
 * Props for the EmptyStateCard component
 */
export interface EmptyStateCardProps {
  /**
   * Lucide icon component to display in the icon container
   * @example Mail, ShieldCheck, AlertCircle
   */
  icon: LucideIcon;

  /**
   * Title text displayed prominently
   */
  title: string;

  /**
   * Descriptive message text
   */
  message: string;

  /**
   * Visual variant of the card
   * @default "empty"
   */
  variant?: EmptyStateVariant;

  /**
   * Optional action elements (buttons, links) displayed at the bottom
   * @example <Button>Try Again</Button>
   */
  actions?: ReactNode;

  /**
   * Optional additional CSS classes for the card wrapper
   */
  className?: string;
}
