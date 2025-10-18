/**
 * Types for StatCard component
 *
 * StatCard is a standardized component for displaying simple metrics
 * with an icon, large value, and label.
 */

import type { LucideIcon } from "lucide-react";

/**
 * Trend direction for the stat metric
 */
export type StatTrend = "up" | "down" | "neutral";

/**
 * Props for the StatCard component
 *
 * @example
 * ```tsx
 * <StatCard
 *   icon={Mail}
 *   value={12500}
 *   label="Emails Sent"
 *   trend="up"
 *   change={5.2}
 * />
 * ```
 */
export interface StatCardProps {
  /**
   * Lucide icon to display
   */
  icon: LucideIcon;

  /**
   * Primary value to display (will be formatted with toLocaleString if number)
   */
  value: string | number;

  /**
   * Label describing the metric
   */
  label: string;

  /**
   * Optional trend indicator
   */
  trend?: StatTrend;

  /**
   * Optional percentage change value (displayed with trend badge)
   */
  change?: number;

  /**
   * Optional description text below the label
   */
  description?: string;

  /**
   * Icon color (CSS color value or Tailwind class)
   * @default "currentColor"
   */
  iconColor?: string;

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
