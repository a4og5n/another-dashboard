/**
 * Types for StatsGridCard component
 *
 * StatsGridCard displays multiple statistics in a grid layout
 * with a header and optional footer actions.
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Individual stat item in the grid
 */
export interface StatGridItem {
  /**
   * The primary value to display (number or formatted string)
   */
  value: string | number;

  /**
   * Label describing what the value represents
   */
  label: string;

  /**
   * Optional text color for the value (CSS color or Tailwind class)
   */
  valueColor?: string;
}

/**
 * Props for the StatsGridCard component
 *
 * @example
 * ```tsx
 * <StatsGridCard
 *   title="Email Opens"
 *   icon={MailOpen}
 *   iconColor="text-blue-500"
 *   stats={[
 *     { value: 1250, label: "Total Opens" },
 *     { value: 980, label: "Unique Opens" },
 *     { value: "23.4%", label: "Open Rate" }
 *   ]}
 * />
 * ```
 */
export interface StatsGridCardProps {
  /**
   * Card title
   */
  title: string;

  /**
   * Optional Lucide icon for the header
   */
  icon?: LucideIcon;

  /**
   * Icon color (CSS color value or Tailwind class)
   * @default "currentColor"
   */
  iconColor?: string;

  /**
   * Array of statistics to display in grid
   * Typically 2-4 items for best layout
   */
  stats: StatGridItem[];

  /**
   * Optional footer content (e.g., buttons, links)
   */
  footer?: ReactNode;

  /**
   * Optional header actions (e.g., toggle switches)
   */
  headerAction?: ReactNode;

  /**
   * Number of columns in the grid
   * @default 3
   */
  columns?: 2 | 3 | 4;

  /**
   * Optional additional CSS classes
   */
  className?: string;

  /**
   * Loading state - shows skeleton
   * @default false
   */
  loading?: boolean;
}
