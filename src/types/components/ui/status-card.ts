/**
 * Types for StatusCard component
 *
 * StatusCard displays a status with badge and associated metrics
 */

import type { ReactNode } from "react";

/**
 * Badge variant for status display
 */
export type StatusVariant = "default" | "secondary" | "destructive" | "outline";

/**
 * Metric item for status card
 */
export interface StatusMetric {
  /**
   * Metric label
   */
  label: string;

  /**
   * Metric value (number or formatted string)
   */
  value: string | number;

  /**
   * Optional text color for the value
   */
  valueColor?: string;
}

/**
 * Props for the StatusCard component
 *
 * @example
 * ```tsx
 * <StatusCard
 *   title="Delivery Status"
 *   status="delivered"
 *   statusVariant="default"
 *   description="Campaign delivery information"
 *   metrics={[
 *     { label: "Emails Sent", value: 5000 },
 *     { label: "Emails Canceled", value: 0 }
 *   ]}
 * />
 * ```
 */
export interface StatusCardProps {
  /**
   * Card title
   */
  title: string;

  /**
   * Status text to display in badge
   */
  status: string;

  /**
   * Badge variant for status
   * @default "default"
   */
  statusVariant?: StatusVariant;

  /**
   * Optional description text below title
   */
  description?: string;

  /**
   * Array of metrics to display
   */
  metrics?: StatusMetric[];

  /**
   * Optional progress value (0-100)
   */
  progress?: number;

  /**
   * Optional action buttons or content
   */
  actions?: ReactNode;

  /**
   * Optional footer content
   */
  footer?: ReactNode;

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
